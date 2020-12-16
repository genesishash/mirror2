module.exports = mirror_mirror = mirror = {
  Proxy: require './lib/proxy'
  ProxyManager: require './lib/proxy_manager'
}

if !module.parent
  server = new mirror.ProxyManager({
    hosts: {

      'local.iptest1.com': {
        host: 'lumtest.com',
        enable_ssl: true,
        silent: false,
        html_modifiers: [
          ((x) ->
            return x.replace('<title>', '<title>(hacked) ')
          )
        ]
        proxy: "http://lum-customer-c_xxxxxxxx-zone-static_res-country-us:xxxxxxxx@zproxy.lum-superproxy.io:22225"
      },

      'local.iptest2.com': {
        host: 'lumtest.com',
        enable_ssl: true,
        silent: false,
        html_modifiers: [
          ((x) ->
            return x.replace('<title>', '<title>(hacked) ')
          )
        ]
        proxy: false
      },


    }
  })

  server.setup ->
    server.listen 7777
    console.log ":7777"

