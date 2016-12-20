define([
    "js/core/core"
], function () {

    $AM.addSeparator = function(){
        $('<div class="automizy-menu-separator"></div>').appendTo($AM.$menuBox);
        return $AM;
    };

});