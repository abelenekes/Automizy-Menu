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

        $AM.$widget = $('<div id="automizy-menu"></div>');
        $AM.$widgetTable = $('<table cellpadding="0" cellspacing="0" border="0" id="automizy-menu-table"></table>').appendTo($AM.$widget);
        $AM.$widgetTr1 = $('<tr id="automizy-menu-tr1"></tr>').appendTo($AM.$widgetTable);
        $AM.$widgetTd1 = $('<td id="automizy-menu-td1"></td>').appendTo($AM.$widgetTr1);
        $AM.$widgetTr2 = $('<tr id="automizy-menu-tr2"></tr>').appendTo($AM.$widgetTable);
        $AM.$widgetTd2 = $('<td id="automizy-menu-td2"></td>').appendTo($AM.$widgetTr2);

        $AM.$widgetTop = $('<div id="automizy-widget-top"></div>').appendTo($AM.$widgetTd1);

        $AM.$logoBox = $('<div id="automizy-menu-logo-box"></div>').appendTo($AM.$widgetTop).click(function(){
            $AM.logoClick();
        });
        $AM.$logoNormal = $('<img id="automizy-menu-logo-normal" src="" />').appendTo($AM.$logoBox);
        $AM.$mobileOpenCloseIcon = $('<span id="automizy-menu-mobile-openclose-icon"></span>').appendTo($AM.$widgetTop);
        $AM.$logoIcon = $('<img id="automizy-menu-logo-icon" src="" />').appendTo($AM.$logoBox);
        $AM.$openCloseIcon = $('<span id="automizy-menu-openclose-icon"></span>').appendTo($AM.$widgetTop);


        $AM.$menuBox = $('<div id="automizy-menu-menuitem-box"></div>').appendTo($AM.$widgetTd2);


        $AM.layoutReady();
        $AM.ready();
    });
});