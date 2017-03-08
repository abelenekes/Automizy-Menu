define([
    "js/core/core"
], function () {
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

});