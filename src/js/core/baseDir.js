define([
    "js/core/core"
], function () {
    $AM.baseDir = function(value){
        if (typeof value !== 'undefined') {
            $AM.config.dir = value;
            return $AM;
        }
        return $AM.config.dir;
    };
});