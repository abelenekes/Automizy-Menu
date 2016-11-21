define([
    "js/core/core",
    "js/core/loadPlugins"
], function () {
    $AM.init = function () {
        if(typeof $AM.automizyInited === 'undefined'){
            $AM.automizyInited = false;
        }

        if(!$AM.automizyInited){
            $AM.automizyInited = true;
            $AM.loadPlugins();
        }

        return $AM;
    };
});