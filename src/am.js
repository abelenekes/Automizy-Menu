define.amd = false;
require([
    "js/core/core",

    "js/core/init",
    "js/core/runTheFunctions",
    "js/core/loadPlugins",
    "js/core/pluginLoader",
    "js/core/baseDir",

    "js/events/pluginsLoaded",
    "js/events/layoutReady",
    "js/events/ready",

    "js/functions/addMenuItem",
    "js/functions/logo",
    "js/functions/logoNormal",
    "js/functions/logoIcon",
    "js/functions/closeAllMenu",
    "js/functions/logoClick",

    "js/modules/menuItem",
    "js/modules/subMenuItem",

    "js/elements/layout"

], function () {
    console.log('%c AutomizyMenu loaded! ', 'background: #000000; color: #bada55; font-size:14px');
});