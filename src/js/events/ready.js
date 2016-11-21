define([
    "js/core/core",
    "js/core/runTheFunctions"
], function () {

    $AM.functions.readyFunctions = [];
    $AM.ready = function(f){
        if(typeof f === 'function') {
            $AM.functions.readyFunctions.push(f);
            if($AM.automizyReady){
                f.apply($AM, []);
            }
            return $AM;
        }
        $AM.runTheFunctions($AM.functions.readyFunctions);
        $AM.automizyReady = true;
        return $AM;
    };

});