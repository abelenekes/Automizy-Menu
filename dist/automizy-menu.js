(function(){
    window.AutomizyGlobalPlugins = window.AutomizyGlobalPlugins || {i:0};
    window.AutomizyGlobalZIndex = window.AutomizyGlobalZIndex || 2000;
    window.AutomizyMenu = window.$AM = new function () {
        var t = this;
        t.version = '0.1.1';
        t.elements = {};
        t.dialogs = {};
        t.inputs = {};
        t.buttons = {};
        t.forms = {};
        t.functions = {};
        t.xhr = {};
        t.modules = {};
        t.menuItems = [];
        t.subMenuList = {};
        t.config = {
            dir:'.',
            url:'https://app.automizy.com'
        };
        t.m = {};
        t.d = {};
    }();
    return $AM;
})();

(function(){
    var PluginLoader = function () {
        var t = this;
        t.d = {
            plugins: [],
            loadedPluginsCount: 0,
            allPluginsCount:0,
            globalPluginsCount:0,
            loadedGlobalPluginsCount:0,
            completeFunctionReady:true,
            completeFunctions: []
        };
    };

    var p = PluginLoader.prototype;


    p.addPlugin = function (plugin) {
        return this.addPlugins([plugin]);
    };

    p.plugins = p.addPlugins = function (plugins) {
        var t = this;
        if (typeof plugins !== 'undefined') {

            for (var i = 0; i < plugins.length; i++) {
                var plugin = plugins[i];
                plugin.skipCondition = plugin.skipCondition || false;
                plugin.complete = plugin.complete || function () {};
                plugin.css = plugin.css || [];
                plugin.js = plugin.js || [];
                plugin.name = plugin.name || ('automizy-plugin-' + ++AutomizyGlobalPlugins.i);

                if (typeof plugin.css === 'string') {
                    plugin.css = [plugin.css];
                }
                if (typeof plugin.js === 'string') {
                    plugin.js = [plugin.js];
                }
                t.d.plugins.push(plugin);
            }

            return t;
        }
        return t.d.plugins;
    };

    p.pluginThen = function(plugin) {
        var t = this;

        t.d.loadedPluginsCount++;
        for(var i = 0; i < plugin.completeFunctions.length; i++){
            plugin.completeFunctions[i].apply(plugin, [true]);
            plugin.completed = true;
        }
        console.log(plugin.name + ' loaded in AutomizySkeleton module (' + t.d.loadedPluginsCount + '/' + t.d.allPluginsCount + ')');
        if (t.d.loadedPluginsCount === t.d.allPluginsCount && t.d.globalPluginsCount === t.d.loadedGlobalPluginsCount && t.d.completeFunctionReady) {
            t.d.completeFunctionReady = false;
            t.complete();
        }

        return t;
    };

    p.run = function () {
        var t = this;

        var hasActivePlugin = false;
        var noJsPlugins = [];

        t.d.allPluginsCount = 0;
        t.d.loadedPluginsCount = 0;

        for (var i = 0; i < t.d.plugins.length; i++) {
            var pluginLocal = t.d.plugins[i];
            if (pluginLocal.inited) {
                continue;
            }
            pluginLocal.inited = true;

            if(typeof AutomizyGlobalPlugins[pluginLocal.name] === 'undefined'){
                AutomizyGlobalPlugins[pluginLocal.name] = {
                    name:pluginLocal.name,
                    skipCondition:pluginLocal.skipCondition,
                    css:pluginLocal.css,
                    js:pluginLocal.js,
                    xhr:false,
                    completed:false,
                    completeFunctions:[pluginLocal.complete]
                }
            }else{
                AutomizyGlobalPlugins[pluginLocal.name].completeFunctions.push(pluginLocal.complete);
                if(AutomizyGlobalPlugins[pluginLocal.name].completed){
                    pluginLocal.complete.apply(pluginLocal, [false]);
                }else {
                    hasActivePlugin = true;
                    t.d.globalPluginsCount++;
                    AutomizyGlobalPlugins[pluginLocal.name].xhr.always(function(){
                        t.d.loadedGlobalPluginsCount++;
                        if (t.d.loadedPluginsCount === t.d.allPluginsCount && t.d.globalPluginsCount === t.d.loadedGlobalPluginsCount && t.d.completeFunctionReady) {
                            t.d.completeFunctionReady = false;
                            t.complete();
                        }
                    })
                }
                continue;
            }

            var plugin = AutomizyGlobalPlugins[pluginLocal.name];

            if (plugin.skipCondition) {
                plugin.completed = true;
                plugin.completeFunctions[0].apply(plugin, [false]);
                continue;
            }

            for (var j = 0; j < plugin.css.length; j++) {
                var head = document.getElementsByTagName('head')[0];
                var link = document.createElement('link');
                link.rel = 'stylesheet';
                link.type = 'text/css';
                link.href = plugin.css[j];
                head.appendChild(link);
            }

            hasActivePlugin = true;
            (function (plugin) {
                var deferreds = [];

                t.d.allPluginsCount++;
                if (plugin.js.length <= 0) {
                    noJsPlugins.push(plugin);
                } else {
                    for (var j = 0; j < plugin.js.length; j++) {
                        deferreds.push($.getScript(plugin.js[j]));
                    }
                    plugin.xhr = $.when.apply(null, deferreds).always(function(){
                        t.pluginThen(plugin);
                    });
                }
            })(plugin);

        }

        for(var i = 0; i < noJsPlugins.length; i++){
            t.pluginThen(noJsPlugins[i]);
        }

        if (!hasActivePlugin) {
            t.complete();
        }

        return t;
    };
    p.complete = function (complete) {
        var t = this;

        if (typeof complete === 'function') {
            t.d.completeFunctionReady = true;
            t.d.completeFunctions.push({
                inited: false,
                func: complete
            });
            return t;
        }

        var arrLength = t.d.completeFunctions.length;
        for (var i = 0; i < arrLength; i++) {
            if (t.d.completeFunctions[i].inited) {
                continue;
            }
            t.d.completeFunctions[i].inited = true;
            t.d.completeFunctions[i].func.apply(t, []);
        }

        return t;
    };

    $AM.pluginLoader = new PluginLoader();

})();

(function(){

    $AM.runTheFunctions = function(functions, thisParameter, parameters){
        var functions = functions || [];
        var thisParameter = thisParameter || $AM;
        var parameters = parameters || [];
        for(var i = 0; i < functions.length; i++) {
            functions[i].apply(thisParameter, parameters);
        }
    };

})();

(function(){

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

})();

(function(){
    $AM.loadPlugins = function () {
        (function () {
            if (typeof window.jQuery === 'undefined') {
                var script = document.createElement("SCRIPT");
                script.src = $AM.config.dir + "/vendor/jquery/jquery.min.js";
                script.type = 'text/javascript';
                document.getElementsByTagName("head")[0].appendChild(script);
            }
            var checkReady = function (callback) {
                if (typeof window.jQuery === 'function') {
                    callback(jQuery);
                } else {
                    window.setTimeout(function () {
                        checkReady(callback);
                    }, 100);
                }
            };

            checkReady(function ($) {
                function hasFont(className, fontFamily){
                    var span = document.createElement('span');
                    span.className = className;
                    span.style.display = 'none';
                    document.body.insertBefore(span, document.body.firstChild);
                    if (window.getComputedStyle(span, null).getPropertyValue('font-family') === fontFamily) {
                        document.body.removeChild(span);
                        return true;
                    }
                    document.body.removeChild(span);
                    return false;
                }
                $AM.pluginLoader.plugins([
                    {
                        name:'fontAwesome',
                        skipCondition:hasFont('fa', 'FontAwesome'),
                        css:$AM.config.dir + "/vendor/fontawesome/css/font-awesome.min.css"
                    },
                    {
                        name:'automizyIconSet',
                        skipCondition:hasFont('automizy-icon', 'Automizy-Icon-Set'),
                        css:$AM.config.dir + "/vendor/automizy-icon-set/automizy-icon-set.css"
                    }
                ]).complete(function(){
                    $AM.pluginsLoaded();
                }).run();

            });

        })();
    };
})();

(function(){
    $AM.init = function () {
        if(typeof $AM.automizyInited === 'undefined'){
            $AM.automizyInited = false;
        }

        if(!$AM.automizyInited){
            $AM.automizyInited = true;
            $AM.loadPlugins();
        }

        return $AM;
    };
})();

(function(){
    $AM.baseDir = function(value){
        if (typeof value !== 'undefined') {
            $AM.config.dir = value;
            return $AM;
        }
        return $AM.config.dir;
    };
})();

(function(){

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

})();

(function(){

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

})();

(function(){

    $AM.addMenuItem = function(){
        var menuItem =  (new $AM.modules.menuItem);
        menuItem.widget().appendTo($AM.$menuBox);
        $AM.menuItems.push(menuItem);
        return menuItem;
    };

})();

(function(){

    $AM.addSeparator = function(){
        $('<div class="automizy-menu-separator"></div>').appendTo($AM.$menuBox);
        return $AM;
    };

})();

(function(){

    $AM.logo = function(srcNormal, srcIcon){
        if(typeof srcNormal !== 'undefined') {
            $AM.logoNormal(srcNormal);
        }
        if(typeof srcIcon !== 'undefined') {
            $AM.logoIcon(srcIcon);
        }
        return $AM;
    };

})();

(function(){

    $AM.logoNormal = function(src){
        if(typeof src !== 'undefined') {
            $AM.ready(function () {
                $AM.$logoNormal.attr('src', src);
            });
            return $AM;
        }
        return $AM.$logoNormal.attr('src');
    };

})();

(function(){

    $AM.logoIcon = function(src){
        if(typeof src !== 'undefined') {
            $AM.ready(function () {
                $AM.$logoIcon.attr('src', src);
            });
            return $AM;
        }
        return $AM.$logoIcon.attr('src');
    };

})();

(function(){

    $AM.closeAllMenu = function(){
        for (var i = 0; i < $AM.menuItems.length; i++) {
            $AM.menuItems[i].close();
        }
    };

})();

(function(){

    $AM.functions.logoClick = function(){};
    $AM.logoClick = function(logoClick){
        if(typeof logoClick !== 'undefined') {
            $AM.functions.logoClick = logoClick;
            return $AM;
        }
        $AM.functions.logoClick.apply($AM, [$AM]);
        return $AM;
    };

})();

(function(){
    $AM.modules.menuItem = function () {
        var t = this;
        t.d = {
            $widget: $('<div class="automizy-menu-menuitem"></div>'),
            $menuItemBox: $('<table class="automizy-menu-menuitem-box" cellpadding="0" cellspacing="0" border="0"></table>'),
            $menuItemRow: $('<tr></tr>'),
            $menuItemIconCell: $('<td class="automizy-menu-menuitem-icon-cell"></td>'),
            $menuItemContentCell: $('<td class="automizy-menu-menuitem-content-cell"></td>'),
            $menuItemArrowCell: $('<td class="automizy-menu-menuitem-arrow-cell"></td>'),
            $icon: $('<span class="automizy-menu-menuitem-icon fa fa-flash"></span>'),
            $content: $('<span class="automizy-menu-menuitem-content"></span>'),
            $arrow: $('<span class="automizy-menu-menuitem-arrow fa fa-angle-right"></span>'),

            $subMenuItemBox: $('<div class="automizy-menu-submenuitem-list"></div>'),

            opened: false,
            single:false,
            visibility:true,
            content: '',
            icon: 'fa fa-flash',
            name: '',
            click:function(){},

            subMenus: []
        };

        t.d.$menuItemBox.appendTo(t.d.$widget);
        t.d.$menuItemRow.appendTo(t.d.$menuItemBox);
        t.d.$menuItemIconCell.appendTo(t.d.$menuItemRow);
        t.d.$menuItemContentCell.appendTo(t.d.$menuItemRow);
        t.d.$menuItemArrowCell.appendTo(t.d.$menuItemRow);
        t.d.$icon.appendTo(t.d.$menuItemIconCell);
        t.d.$content.appendTo(t.d.$menuItemContentCell);
        t.d.$arrow.appendTo(t.d.$menuItemArrowCell);
        t.d.$subMenuItemBox.appendTo(t.d.$widget);

        t.d.$menuItemBox.click(function () {
            t.click();
            if(t.d.subMenus.length > 0) {
                t.toggle();
            }
        });

        t.setDisplay();
    };


    var p = $AM.modules.menuItem.prototype;

    p.widget = function () {
        return this.d.$widget;
    };
    p.name = function (name) {
        var t = this;
        if (typeof name !== 'undefined') {
            t.d.name = name;
            return t;
        }
        return t.d.name;
    };
    p.open = function () {
        var t = this;
        $AM.closeAllMenu();
        t.d.opened = true;
        t.widget().addClass('automizy-active');
        t.d.$subMenuItemBox.stop().slideDown();
        t.d.$arrow.removeClass('fa-angle-right').addClass('fa-angle-down');
        return t;
    };
    p.close = function () {
        var t = this;
        t.d.opened = false;
        t.d.$subMenuItemBox.stop().slideUp();
        t.widget().removeClass('automizy-active');
        t.d.$arrow.removeClass('fa-angle-down').addClass('fa-angle-right');
        return t;
    };
    p.toggle = function () {
        var t = this;
        if (t.d.opened === false) {
            t.open();
        } else {
            t.close();
        }
        return t;
    };

    p.click = function (clickFunction) {
        var t = this;
        if (typeof clickFunction !== 'undefined') {
            t.d.click = clickFunction;
            return t;
        }
        t.d.click.apply(t, [t]);
        return t;
    };

    p.content = p.html = p.text = function (content) {
        var t = this;
        if (typeof content !== 'undefined') {
            t.d.content = content;
            t.d.$content.empty();
            if (typeof t.d.content === 'object') {
                if (typeof t.d.content.drawTo === 'function') {
                    t.d.content.drawTo(t.d.$content);
                } else if (typeof t.d.content.appendTo === 'function') {
                    t.d.content.appendTo(t.d.$content);
                } else {
                    t.d.$content.html(t.d.content);
                }
            } else {
                t.d.$content.html(t.d.content);
            }
            return t;
        }
        return t.d.content;
    };

    p.icon = function (icon, iconType) {
        var t = this;
        if (typeof icon !== 'undefined') {
            t.d.icon = icon;
            if (t.d.icon === false) {
                t.widget().removeClass('automizy-has-icon');
            } else if (t.d.icon === true) {
                t.widget().addClass('automizy-has-icon');
            } else {
                t.widget().addClass('automizy-has-icon');
                var iconType = iconType || 'fa';
                if (iconType === 'fa') {
                    t.d.$icon.removeClass(function (index, css) {
                        return (css.match(/(^|\s)fa-\S+/g) || []).join(' ');
                    }).addClass('fa').addClass(icon);
                }
            }
            return t;
        }
        return t.d.icon || false;
    };

    p.single = function(single){
        var t = this;
        if (typeof single !== 'undefined') {
            t.d.single = single || false;
            t.widget().toggleClass('automizy-menu-menuitem-single', t.d.single);
            t.setDisplay();
            return t;
        }
        return t.d.single;
    };
    p.hide = function(){
        var t = this;
        t.widget().hide();
        return t;
    };
    p.show = function(){
        var t = this;
        t.widget().show();
        return t;
    };
    p.visibility = function(visibility){
        var t = this;
        if (typeof visibility !== 'undefined') {
            t.d.visibility = visibility || false;
            if (t.d.visibility) {
                t.show();
            } else {
                t.hide();
            }
            return t;
        }
        return t.d.visibility;
    };
    p.setDisplay = function(){
        var t = this;
        if(!t.d.visibility){
            return t;
        }
        if(t.d.subMenus.length > 0 || t.single()) {
            t.show();
        }else{
            t.hide();
        }
        return t;
    };

    p.addSubMenu = function () {
        var t = this;
        var subMenuItem = (new $AM.modules.subMenuItem);
        subMenuItem.parent(t);
        t.setDisplay();
        return subMenuItem;
    };

    p.removeSubMenu = function (name) {
        var t = this;
        for (var i = 0; i < t.d.subMenus.length; i++) {
            if (t.d.subMenus[i].name === name) {
                t.d.subMenus[i].removeFromParent();
            }
        }
        t.setDisplay();
        return t;
    }

})();

(function(){
    $AM.modules.subMenuItem = function () {
        var t = this;
        t.d = {
            $widget: $('<div class="automizy-menu-submenuitem"></div>'),
            $icon: $('<span class="automizy-menu-submenuitem-icon fa fa-circle"></span>'),
            $content: $('<span class="automizy-menu-submenuitem-content"></span>'),

            parent: false,

            click: function () {},

            visibility:true,
            content: '',
            icon: 'fa fa-circle',
            name: ''
        };

        t.d.$icon.appendTo(t.d.$widget);
        t.d.$content.appendTo(t.d.$widget);

        t.d.$widget.click(function () {
            t.click();
        })
    };


    var p = $AM.modules.subMenuItem.prototype;

    p.widget = function () {
        return this.d.$widget;
    };
    p.name = function (name) {
        var t = this;
        if (typeof name !== 'undefined') {
            delete $AM.subMenuList[t.d.name];
            t.d.name = name;
            $AM.subMenuList[t.d.name] = t;
            return t;
        }
        return t.d.name;
    };
    p.click = function (clickFunction) {
        var t = this;
        if (typeof clickFunction !== 'undefined') {
            t.d.click = clickFunction;
            return t;
        }
        t.d.click.apply(t, [t]);
        t.active();
        return t;
    };

    p.active = function(){
        var t = this;
        $AM.$menuBox.find('.automizy-menu-submenuitem').removeClass('automizy-active');
        t.widget().addClass('automizy-active');
        t.parent().open();
        return t;
    };

    p.content = p.html = p.text = function (content) {
        var t = this;
        if (typeof content !== 'undefined') {
            t.d.content = content;
            t.d.$content.empty();
            if (typeof t.d.content === 'object') {
                if (typeof t.d.content.drawTo === 'function') {
                    t.d.content.drawTo(t.d.$content);
                } else if (typeof t.d.content.appendTo === 'function') {
                    t.d.content.appendTo(t.d.$content);
                } else {
                    t.d.$content.html(t.d.content);
                }
            } else {
                t.d.$content.html(t.d.content);
            }
            return t;
        }
        return t.d.content;
    };


    p.icon = function (icon, iconType) {
        var t = this;
        if (typeof icon !== 'undefined') {
            t.d.icon = icon;
            if (t.d.icon === false) {
                t.widget().removeClass('automizy-has-icon');
            } else if (t.d.icon === true) {
                t.widget().addClass('automizy-has-icon');
            } else {
                t.widget().addClass('automizy-has-icon');
                var iconType = iconType || 'fa';
                if (iconType === 'fa') {
                    t.d.$icon.removeClass(function (index, css) {
                        return (css.match(/(^|\s)fa-\S+/g) || []).join(' ');
                    }).addClass('fa').addClass(icon);
                }
            }
            return t;
        }
        return t.d.icon || false;
    };

    p.hide = function(){
        var t = this;
        t.widget().hide();
        return t;
    };
    p.show = function(){
        var t = this;
        t.widget().show();
        return t;
    };
    p.visibility = function(visibility){
        var t = this;
        if (typeof visibility !== 'undefined') {
            t.d.visibility = visibility || false;
            if (t.d.visibility) {
                t.show();
            } else {
                t.hide();
            }
            return t;
        }
        return t.d.visibility;
    };

    p.parent = function (parent) {
        var t = this;
        if (typeof parent !== 'undefined') {
            t.removeFromParent();
            t.d.parent = parent;
            t.d.parent.d.subMenus.push(t);
            t.widget().appendTo(parent.d.$subMenuItemBox);
        }
        return t.d.parent;
    };

    p.removeFromParent = function () {
        var t = this;
        if (t.d.parent !== false) {
            for (var i = 0; i < t.d.parent.d.subMenus.length; i++) {
                if (t.d.parent.d.subMenus[i].name() === t.name()) {
                    t.d.parent.d.subMenus.splice(i, 1);
                    t.widget().appendTo($AM.$tmp);
                }
            }
            t.d.parent.setDisplay();
        }
        return t;
    };

    $AM.getSubMenu = function(name){
        for (var i = 0; i < $AM.menuItems.length; i++) {
            for(var j = 0; j < $AM.menuItems[i].d.subMenus.length; j++){
                if($AM.menuItems[i].d.subMenus[j].name() === name){
                    return $AM.menuItems[i].d.subMenus[j];
                }
            }
        }
        return false;
    }

})();

(function(){
    $AM.pluginsLoaded(function () {

        $AM.$tmp = $('<div id="automizy-menu-tmp"></div>');

        $AM.$widget = $('<div id="automizy-menu"></div>');
        $AM.$widgetTable = $('<table cellpadding="0" cellspacing="0" border="0" id="automizy-menu-table"></table>').appendTo($AM.$widget);
        $AM.$menuHeaderWrapper = $('<tr id="automizy-menu-tr1"></tr>').appendTo($AM.$widgetTable);
        $AM.$menuHeader = $('<td id="automizy-menu-header"></td>').appendTo($AM.$menuHeaderWrapper);
        $AM.$menuItemListWrapper = $('<tr id="automizy-menu-tr2"></tr>').appendTo($AM.$widgetTable);
        $AM.$menuItemList = $('<td id="automizy-menu-item-list"></td>').appendTo($AM.$menuItemListWrapper);

        $AM.$widgetTop = $('<div id="automizy-widget-top"></div>').appendTo($AM.$menuHeader);

        $AM.$logoBox = $('<div id="automizy-menu-logo-box"></div>').appendTo($AM.$widgetTop).click(function(){
            $AM.logoClick();
        });
        $AM.$logoNormal = $('<img id="automizy-menu-logo-normal" src="" />').appendTo($AM.$logoBox);
        $AM.$mobileOpenCloseIcon = $('<span id="automizy-menu-mobile-openclose-icon"></span>').appendTo($AM.$widgetTop);
        $AM.$logoIcon = $('<img id="automizy-menu-logo-icon" src="" />').appendTo($AM.$logoBox);
        $AM.$openCloseIcon = $('<span id="automizy-menu-openclose-icon"></span>').appendTo($AM.$widgetTop);


        $AM.$menuBox = $('<div id="automizy-menu-menuitem-box"></div>').appendTo($AM.$menuItemList);


        $AM.layoutReady();
        $AM.ready();
    });
})();

(function(){
    console.log('%c AutomizyMenu loaded! ', 'background: #000000; color: #bada55; font-size:14px');
})();

(function(){})();