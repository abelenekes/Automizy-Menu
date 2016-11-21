define([
    "js/core/core"
], function () {
    $AM.modules.menuItem = function () {
        var t = this;
        t.d = {
            $widget: $('<div class="automizy-menu-menuitem"></div>'),
            $menuItemBox: $('<div class="automizy-menu-menuitem-box"></div>'),
            $icon: $('<span class="automizy-menu-menuitem-icon fa fa-flash"></span>'),
            $content: $('<span class="automizy-menu-menuitem-content"></span>'),
            $arrow: $('<span class="automizy-menu-menuitem-arrow fa fa-angle-right"></span>'),

            $subMenuItemBox: $('<div class="automizy-menu-submenuitem-list"></div>'),

            opened: false,
            content: '',
            icon: 'fa fa-flash',
            name: '',

            subMenus: []
        };

        t.d.$menuItemBox.appendTo(t.d.$widget);
        t.d.$icon.appendTo(t.d.$menuItemBox);
        t.d.$content.appendTo(t.d.$menuItemBox);
        t.d.$arrow.appendTo(t.d.$menuItemBox);
        t.d.$subMenuItemBox.appendTo(t.d.$widget);

        t.d.$menuItemBox.click(function () {
            t.toggle();
        })
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

    p.addSubMenu = function () {
        var t = this;
        var subMenuItem = (new $AM.modules.subMenuItem);
        subMenuItem.parent(t);
        return subMenuItem;
    };

    p.removeSubMenu = function (name) {
        var t = this;
        for (var i = 0; i < t.d.subMenus.length; i++) {
            if (t.d.subMenus[i].name === name) {
                t.d.subMenus[i].remove();
            }
        }
        return t;
    }

});