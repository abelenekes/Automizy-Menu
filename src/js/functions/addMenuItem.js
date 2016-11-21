define([
    "js/core/core"
], function () {

    $AM.addMenuItem = function(){
        var menuItem =  (new $AM.modules.menuItem);
        menuItem.widget().appendTo($AM.$menuBox);
        $AM.menuItems.push(menuItem);
        return menuItem;
    };

});