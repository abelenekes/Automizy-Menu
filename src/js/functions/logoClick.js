define([
    "js/core/core"
], function () {

    $AM.functions.logoClick = function(){};
    $AM.logoClick = function(logoClick){
        if(typeof logoClick !== 'undefined') {
            $AM.functions.logoClick = logoClick;
            return $AM;
        }
        $AM.functions.logoClick.apply($AM, [$AM]);
        return $AM;
    };

});