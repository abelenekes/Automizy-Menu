define([
    "js/core/core"
], function () {

    $AM.logo = function(srcNormal, srcIcon){
        if(typeof srcNormal !== 'undefined') {
            $AM.logoNormal(srcNormal);
        }
        if(typeof srcIcon !== 'undefined') {
            $AM.logoIcon(srcIcon);
        }
        return $AM;
    };

});