(function() {
  var d = window.document
  var wsServerUrl = window.location.protocol
    + '//' + (window.location.host || 'localhost').split(':')[0]
    + ':38670/';
  
  if (!window['__ROLLUP_PLUGIN_HOT_RUNTIME']) {
    var loaded = false;
    var callbacks = [];
    window['__ROLLUP_PLUGIN_HOT_RUNTIME'] = {
      host: null,
      port: 38670,
      ws: false,
      then: function(cb) {
        if (loaded) {
          setTimeout(cb, 0);
        } else {
          callbacks.push(cb);
        }
      }
    };
    var script = d.createElement('script');
    script.async = 1;
    script.src = wsServerUrl + 'runtime/hmr-runtime.js';
    script.onload = () => {
      loaded = true;
      callbacks.splice(0, callbacks.length).forEach(function(cb) {
        cb();
      });
    };
    d.head.appendChild(script);
  }
  window['__ROLLUP_PLUGIN_HOT_RUNTIME'].then(function() {
    System.import("undefinedsrc/main.js", wsServerUrl).catch(err => {
    console.error(err && err.stack || err);
  });
  });

})();
