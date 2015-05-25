cordova.define("lockman-key-plugin.lockmanKeyPlugin", function(require, exports, module) { /*global cordova, module*/

module.exports = {
    greet: function (name, successCallback, errorCallback) {
        cordova.exec(successCallback, errorCallback, "LockmanKeyPlugin", "greet", [name]);
    }
};

});
