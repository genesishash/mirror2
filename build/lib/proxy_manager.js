// Generated by IcedCoffeeScript 108.0.9
(function() {
  var Proxy, ProxyManager, connect, http, httpProxy, iced, log, logger, proxy_man, _, __iced_deferrals, __iced_k, __iced_k_noop,
    __slice = [].slice,
    __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

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

  logger = require('./logger');

  _ = require('wegweg')({
    globals: false,
    shelljs: false
  });

  http = require('http');

  connect = require('connect');

  httpProxy = require('http-proxy');

  Proxy = require('./proxy');

  module.exports = ProxyManager = (function(_super) {
    __extends(ProxyManager, _super);

    ProxyManager.prototype.hosts = {};

    ProxyManager.prototype.servers = {};

    function ProxyManager(opt) {
      var _base, _ref;
      this.opt = opt != null ? opt : {};
      if ((_base = this.opt).port == null) {
        _base.port = 7777;
      }
      this.hosts = (_ref = this.opt.hosts) != null ? _ref : {};
      this.opt.middleware = [];
    }

    ProxyManager.prototype.setup = function(cb) {
      var app, host, host_item, x, ___iced_passed_deferral, __iced_deferrals, __iced_k;
      __iced_k = __iced_k_noop;
      ___iced_passed_deferral = iced.findDeferral(arguments);
      (function(_this) {
        return (function(__iced_k) {
          if (_.size(_this.hosts)) {
            (function(__iced_k) {
              var _i, _k, _keys, _ref, _results, _while;
              _ref = _this.hosts;
              _keys = (function() {
                var _results1;
                _results1 = [];
                for (_k in _ref) {
                  _results1.push(_k);
                }
                return _results1;
              })();
              _i = 0;
              _while = function(__iced_k) {
                var _break, _continue, _next;
                _break = __iced_k;
                _continue = function() {
                  return iced.trampoline(function() {
                    ++_i;
                    return _while(__iced_k);
                  });
                };
                _next = _continue;
                if (!(_i < _keys.length)) {
                  return _break();
                } else {
                  host = _keys[_i];
                  host_item = _ref[host];
                  (function(__iced_k) {
                    __iced_deferrals = new iced.Deferrals(__iced_k, {
                      parent: ___iced_passed_deferral,
                      filename: "/Users/douglaslauer/www/lab/host-proxy/src/lib/proxy_manager.iced",
                      funcname: "ProxyManager.setup"
                    });
                    _this.setup_proxy(host, host_item, __iced_deferrals.defer({
                      lineno: 28
                    }));
                    __iced_deferrals._fulfill();
                  })(_next);
                }
              };
              _while(__iced_k);
            })(__iced_k);
          } else {
            return __iced_k();
          }
        });
      })(this)((function(_this) {
        return function() {
          var _i, _len, _ref, _ref1;
          _this.http_proxy = httpProxy.createProxyServer({
            ws: true,
            xfwd: true,
            autoRewrite: true,
            hostRewrite: true,
            protocolRewrite: 'http'
          });
          _this.http_proxy.on('error', function(e) {
            return _this.emit('error', e);
          });
          app = connect();
          if ((_ref = _this.opt.middleware) != null ? _ref.length : void 0) {
            _ref1 = _this.opt.middleware;
            for (_i = 0, _len = _ref1.length; _i < _len; _i++) {
              x = _ref1[_i];
              app.use(x);
            }
          }
          app.use((function(req, res, next) {
            var host, host_item, request_opts, ___iced_passed_deferral1, __iced_deferrals, __iced_k, _ref2, _ref3, _ref4, _ref5;
            __iced_k = __iced_k_noop;
            ___iced_passed_deferral1 = iced.findDeferral(arguments);
            host = (_ref2 = (_ref3 = (_ref4 = req.hostname) != null ? _ref4 : (_ref5 = req.headers) != null ? _ref5.host : void 0) != null ? _ref3 : req.host) != null ? _ref2 : false;
            if (!host) {
              return next(new Error('`host` unparsable'));
            }
            if (host.includes(':')) {
              host = host.split(':').shift();
            }
            req.proxy_host = host;
            _this.emit('request', req);
            if (!(host_item = _this.hosts[host])) {
              _this.emit('request_ignored', req);
              req._code = 403;
              return next(new Error('Forbidden'));
            }
            (function(__iced_k) {
              if (!_this.servers[host]) {
                (function(__iced_k) {
                  __iced_deferrals = new iced.Deferrals(__iced_k, {
                    parent: ___iced_passed_deferral1,
                    filename: "/Users/douglaslauer/www/lab/host-proxy/src/lib/proxy_manager.iced"
                  });
                  _this.setup_proxy(host, host_item, __iced_deferrals.defer({
                    lineno: 64
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
              _this.emit('request_delivered', req);
              return _this.http_proxy.web(req, res, request_opts, function(e) {
                return next(e);
              });
            });
          }));
          app.use(function(err, req, res) {
            var _ref2;
            this.emit('error', err);
            return res.end(err.toString(), (_ref2 = req._code) != null ? _ref2 : 500);
          });
          _this.http = http.createServer(app);
          return cb(null, true);
        };
      })(this));
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
            lineno: 86
          }));
          __iced_deferrals._fulfill();
        });
      })(this)((function(_this) {
        return function() {
          p.listen();
          _this.emit('server_spawned', {
            host: host,
            port: p.port,
            options: opt
          });
          return cb(null, p.port);
        };
      })(this));
    };

    ProxyManager.prototype.listen = function() {
      return this.http.listen(this.opt.port);
    };

    return ProxyManager;

  })((require('events').EventEmitter));

  if (!module.parent) {
    proxy_man = new ProxyManager({
      hosts: {
        'localhost': {
          host: 'stackoverflow.com',
          append_head: "<script>alert('stackoverflow')</script>",
          html_modifiers: [
            (function(x) {
              return x.replace('<title>', '<title>(mirror-mirror) ');
            })
          ]
        },
        'proxy.com': {
          host: 'greatist.com',
          append_head: "<script>alert('greatist.com')</script>",
          html_modifiers: [
            (function(x) {
              return x.replace('<title>', '<title>(mirror-mirror) ');
            })
          ]
        }
      }
    });
    proxy_man.on('error', function(e) {
      log('error');
      return log(e.toString());
    });
    proxy_man.on('server_spawned', function(data) {
      log(/server spawned/);
      return log(data);
    });
    (function(_this) {
      return (function(__iced_k) {
        __iced_deferrals = new iced.Deferrals(__iced_k, {
          filename: "/Users/douglaslauer/www/lab/host-proxy/src/lib/proxy_manager.iced"
        });
        proxy_man.setup(__iced_deferrals.defer({
          lineno: 129
        }));
        __iced_deferrals._fulfill();
      });
    })(this)((function(_this) {
      return function() {
        proxy_man.listen(7777);
        return __iced_k(log(":7777"));
      };
    })(this));
  } else {
    __iced_k();
  }

}).call(this);
