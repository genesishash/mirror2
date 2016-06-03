# vim: set expandtab tabstop=2 shiftwidth=2 softtabstop=2
log = (x...) -> try console.log x...

_ = require('wegweg')({
  globals: no
  shelljs: no
})

http = require 'http'
harmon = require 'harmon'
connect = require 'connect'
mitm = require 'http-mitm-proxy'
httpProxy = require 'http-proxy'

module.exports = class Proxy

  constructor: (@opt={}) ->
    @opt.host ?= "stackoverflow.com"

  setup: (cb) ->
    if !@opt.proxy_port
      await @_find_port defer e,open_port
      @opt.proxy_port = open_port

    if !@opt.port
      await @_find_port defer e,open_port
      @opt.port = open_port

    @port = @opt.port
    @proxy_port = @opt.proxy_port

    @setup_proxy()
    @setup_http()

    cb null, @opt

  setup_proxy: ->
    @proxy = mitm()
    @proxy.use mitm.gunzip

    @proxy.onRequest (ctx,cb) =>
      chunks = []

      ctx.isSSL = false
      ctx.proxyToServerRequestOptions.headers['accept-encoding'] = 'gzip'

      ctx.onResponseData (ctx,chunk,next) =>
        chunks.push(chunk)
        return next()

      ctx.onResponseEnd (ctx,next) =>
        body = Buffer.concat(chunks)
        bulk = body.toString()

        url = ctx.clientToProxyRequest.url

        _end = ((s) ->
          ctx.proxyToClientResponse.write(s)
          return next()
        )

        return _end(body) if !bulk.includes('</head>')

        content_type = ctx.serverToProxyResponse.headers?['content-type'] ? 'none'
        return _end(body) if !(content_type.indexOf('text/html') > -1)

        if @opt.script
          bulk = bulk.replace(/<\/head>/g,@opt.script + '</head>')

        return _end(bulk)

      return cb()

  setup_http: ->
    @http_proxy = httpProxy.createProxyServer({
      ws: yes
      xfwd: yes
      autoRewrite: yes
      hostRewrite: yes
      protocolRewrite: 'http'
    })

    # rewriter
    _rewrite = (attr_name,node) =>
      attr = node.getAttribute attr_name
      return if !attr?.includes?(@opt.host)

      new_value = attr

      for x in ['https://','http://','//']
        if new_value.startsWith(x + @opt.host)
          new_value = new_value.substr((x + @opt.host).length)

      node.setAttribute attr_name, new_value

    selects = [{
      query: 'a, link'
      func: ((node) =>
        _rewrite('href',node)
      )
    },{
      query: 'img, script'
      func: ((node) =>
        _rewrite('src',node)
      )
    }]

    app = connect()
    app.use harmon([],selects,yes)

    app.use ((req,res) =>
      req.headers.host = @opt.host

      request_opts = {
        target: 'http://127.0.0.1:' + @opt.proxy_port
      }

      if agent = req.headers['User-Agent']
        request_opts.agent = agent

      @http_proxy.web(req,res,request_opts)
    )

    @http = http.createServer(app)

  listen: ->
    @proxy.listen {
      port: @opt.proxy_port
    }
    @http.listen @opt.port

  _find_port: (cb) ->
    @portrange ?= 45032

    port = @portrange
    @portrange += 1

    server = require('net').connect port, =>
      server.destroy()
      @_find_port cb

    server.on 'error', ->
      return cb null, port

##
if !module.parent
  p = new Proxy {
    host: 'greatist.com'
    port: 8009
  }

  await p.setup defer()

  p.listen()
  log ":8009"

