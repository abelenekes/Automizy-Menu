define([
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

    "js/modules/menuItem",
    "js/modules/subMenuItem"
], function () {
    $AM.pluginsLoaded(function () {

        $AM.$tmp = $('<div id="automizy-menu-tmp"></div>');

        $AM.$widget = $('<div id="automizy-menu" class="automizy-menu-closed"></div>');
        $AM.$widgetTable = $('<table cellpadding="0" cellspacing="0" border="0" id="automizy-menu-table"></table>').appendTo($AM.$widget);

        /*The menu header*/
        $AM.$menuHeaderWrapper = $('<tr id="automizy-menu-header-wrapper"></tr>').appendTo($AM.$widgetTable);
        $AM.$menuHeader = $('<td id="automizy-menu-header"></td>').appendTo($AM.$menuHeaderWrapper);

        /*The menu item list*/
        $AM.$menuItemListWrapper = $('<tr id="automizy-menu-item-list-wrapper"></tr>').appendTo($AM.$widgetTable);
        $AM.$menuItemList = $('<td id="automizy-menu-item-list"></td>').appendTo($AM.$menuItemListWrapper);

        $AM.$widgetTop = $('<div id="automizy-widget-top"></div>').appendTo($AM.$menuHeader);

        $AM.$logoBox = $('<div id="automizy-menu-logo-box"></div>').appendTo($AM.$widgetTop).click(function(){
            $AM.logoClick();
        });
        $AM.$logoNormal = $('<img id="automizy-menu-logo-normal" src="" />').appendTo($AM.$logoBox);
        $AM.$mobileOpenCloseIcon = $('<span id="automizy-menu-mobile-openclose-icon"></span>').appendTo($AM.$widgetTop);
        $AM.$logoIcon = $('<img id="automizy-menu-logo-icon" src="" />').appendTo($AM.$logoBox);
        $AM.$openCloseIcon = $('<span id="automizy-menu-openclose-icon" title="Close sidebar" class="fa fa-outdent"></span>').appendTo($AM.$widgetTop);


        $AM.$menuBox = $('<div id="automizy-menu-item-box"></div>').appendTo($AM.$menuItemList);


        $AM.layoutReady();
        $AM.ready();
    });
});