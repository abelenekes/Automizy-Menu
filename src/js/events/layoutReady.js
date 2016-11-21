define([
    "js/core/core",
    "js/core/runTheFunctions"
], function () {

    $AM.functions.layoutReadyFunctions = [];
    $AM.layoutReady = function(f){
        if(typeof f === 'function') {
            $AM.functions.layoutReadyFunctions.push(f);
            if($AM.automizyLayoutReady){
                f.apply($AM, []);
            }
            return $AM;
        }
        $AM.runTheFunctions($AM.functions.layoutReadyFunctions);
        $AM.automizyLayoutReady = true;
        return $AM;
    };

});