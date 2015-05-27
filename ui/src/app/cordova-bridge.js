
var cordovaBridge = {
  call: function (command/* args..., callback*/) {
    var args = Array.prototype.slice.call(arguments);
    cordova.exec(args.slice(-1)[0], function (message) {
      alert("Error\n" + message);
    }, "LockmanKeyPlugin", command, args.slice(1, -1));
  }
};

module.exports = cordovaBridge;
