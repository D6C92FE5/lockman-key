cordova.define('cordova/plugin_list', function(require, exports, module) {
module.exports = [
    {
        "file": "plugins/cordova-plugin-whitelist/whitelist.js",
        "id": "cordova-plugin-whitelist.whitelist",
        "runs": true
    },
    {
        "file": "plugins/lockman-key-plugin/www/lockman-key-plugin.js",
        "id": "lockman-key-plugin.lockmanKeyPlugin",
        "clobbers": [
            "lockmanKeyPlugin"
        ]
    }
];
module.exports.metadata = 
// TOP OF METADATA
{
    "cordova-plugin-whitelist": "1.0.0",
    "lockman-key-plugin": "0.1.0"
}
// BOTTOM OF METADATA
});