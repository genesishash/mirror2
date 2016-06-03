// Generated by IcedCoffeeScript 108.0.9
(function() {
  var Proxy, ProxyManager, connect, http, httpProxy, iced, log, _, __iced_k, __iced_k_noop,
    __slice = [].slice;

  iced = {
    Deferrals: (function() {
      function _Class(_arg) {
        this.continuation = _arg;
        this.count = 1;
        this.ret = null;
      }

      _Class.prototype._fulfill = function() {
        if (!--this.count) {
          return this.continuation(this.ret);
        }
      };

      _Class.prototype.defer = function(defer_params) {
        ++this.count;
        return (function(_this) {
          return function() {
            var inner_params, _ref;
            inner_params = 1 <= arguments.length ? __slice.call(arguments, 0) : [];
            if (defer_params != null) {
              if ((_ref = defer_params.assign_fn) != null) {
                _ref.apply(null, inner_params);
              }
            }
            return _this._fulfill();
          };
        })(this);
      };

      return _Class;

    })(),
    findDeferral: function() {
      return null;
    },
    trampoline: function(_fn) {
      return _fn();
    }
  };
  __iced_k = __iced_k_noop = function() {};

  log = function() {
    var x;
    x = 1 <= arguments.length ? __slice.call(arguments, 0) : [];
    try {
      return console.log.apply(console, x);
    } catch (_error) {}
  };

  _ = require('wegweg')({
    globals: false,
    shelljs: false
  });

  http = require('http');

  connect = require('connect');

  httpProxy = require('http-proxy');

  Proxy = require('./proxy');

  ProxyManager = (function() {
    ProxyManager.prototype.hosts = {};

    ProxyManager.prototype.servers = {};

    function ProxyManager(opt) {
      var _base, _ref;
      this.opt = opt != null ? opt : {};
      if ((_base = this.opt).port == null) {
        _base.port = 7777;
      }
      this.hosts = (_ref = this.opt.hosts) != null ? _ref : {};
    }

    ProxyManager.prototype.refresh_hosts = function(hosts) {
      return this.hosts = hosts;
    };

    ProxyManager.prototype.setup = function(cb) {
      var app;
      this.http_proxy = httpProxy.createProxyServer({
        ws: true,
        xfwd: true,
        autoRewrite: true,
        hostRewrite: true,
        protocolRewrite: 'http'
      });
      app = connect();
      app.use(((function(_this) {
        return function(req, res, next) {
          var host, host_item, request_opts, ___iced_passed_deferral, __iced_deferrals, __iced_k, _ref, _ref1, _ref2, _ref3;
          __iced_k = __iced_k_noop;
          ___iced_passed_deferral = iced.findDeferral(arguments);
          host = (_ref = (_ref1 = (_ref2 = req.hostname) != null ? _ref2 : (_ref3 = req.headers) != null ? _ref3.host : void 0) != null ? _ref1 : req.host) != null ? _ref : false;
          if (host.includes(':')) {
            host = host.split(':').shift();
          }
          if (!(host_item = _this.hosts[host])) {
            return res.end("Forbidden", 403);
          }
          (function(__iced_k) {
            if (!_this.servers[host]) {
              (function(__iced_k) {
                __iced_deferrals = new iced.Deferrals(__iced_k, {
                  parent: ___iced_passed_deferral,
                  filename: "/Users/douglaslauer/www/lab/host-proxy/src/lib/proxy_manager.iced"
                });
                _this.setup_proxy(host, host_item, __iced_deferrals.defer({
                  lineno: 46
                }));
                __iced_deferrals._fulfill();
              })(__iced_k);
            } else {
              return __iced_k();
            }
          })(function() {
            request_opts = {
              target: 'http://127.0.0.1:' + _this.servers[host].port
            };
            return _this.http_proxy.web(req, res, request_opts);
          });
        };
      })(this)));
      this.http = http.createServer(app);
      return cb(null, true);
    };

    ProxyManager.prototype.setup_proxy = function(host, opt, cb) {
      var p, ___iced_passed_deferral, __iced_deferrals, __iced_k;
      __iced_k = __iced_k_noop;
      ___iced_passed_deferral = iced.findDeferral(arguments);
      this.servers[host] = p = new Proxy(opt);
      (function(_this) {
        return (function(__iced_k) {
          __iced_deferrals = new iced.Deferrals(__iced_k, {
            parent: ___iced_passed_deferral,
            filename: "/Users/douglaslauer/www/lab/host-proxy/src/lib/proxy_manager.iced",
            funcname: "ProxyManager.setup_proxy"
          });
          p.setup(__iced_deferrals.defer({
            lineno: 61
          }));
          __iced_deferrals._fulfill();
        });
      })(this)((function(_this) {
        return function() {
          p.listen();
          return cb(null, p.port);
        };
      })(this));
    };

    ProxyManager.prototype.listen = function() {
      return this.http.listen(this.opt.port);
    };

    return ProxyManager;

  })();


  /*
  if !module.parent
    proxy_man = new ProxyManager({
      hosts: {
        'localhost': {
          host: 'stackoverflow.com'
          script: """
            <script>alert('stackoverflow')</script>
          """
        }
        'proxy.com': {
          host: 'greatist.com'
          script: """
            <script>alert('greatist.com')</script>
          """
        }
      }
    })
  
    await proxy_man.setup defer()
  
    proxy_man.listen 7777
    log ":7777"
   */

}).call(this);
