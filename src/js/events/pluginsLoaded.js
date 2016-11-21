define([
    "js/core/core",
    "js/core/runTheFunctions"
], function () {

    $AM.functions.pluginsLoadedFunctions = [];
    $AM.pluginsLoaded = function(f){
        if(typeof f === 'function'){
            $AM.functions.pluginsLoadedFunctions.push(f);
            if($AM.automizyPluginsLoaded){
                f.apply($AM, []);
            }
            return $AM;
        }
        $AM.runTheFunctions($AM.functions.pluginsLoadedFunctions, $AM, []);
        $AM.automizyPluginsLoaded = true;
        return $AM;
    };

});