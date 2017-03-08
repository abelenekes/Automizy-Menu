define([
    "js/core/core"
], function () {
    $AM.modules.menuItem = function () {
        var t = this;
        t.d = {
            $widget: $('<div class="automizy-menu-item"></div>'),
            $menuItemBox: $('<table class="automizy-menu-item-box" cellpadding="0" cellspacing="0" border="0"></table>'),
            $menuItemRow: $('<tr></tr>'),
            $menuItemIconCell: $('<td class="automizy-menu-item-icon-cell"></td>'),
            $menuItemContentCell: $('<td class="automizy-menu-item-content-cell"></td>'),
            $menuItemArrowCell: $('<td class="automizy-menu-item-arrow-cell"></td>'),
            $icon: $('<span class="automizy-menu-item-icon fa fa-flash"></span>'),
            $content: $('<span class="automizy-menu-item-content"></span>'),
            $arrow: $('<span class="automizy-menu-item-arrow fa fa-angle-right"></span>'),

            $subMenuItemBox: $('<div class="automizy-menu-submenu-item-list"></div>'),

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
            t.toggle();
        })

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
        t.active();
        if(t.d.subMenus.length > 0){
            t.d.$subMenuItemBox.stop().slideDown();
            t.d.$arrow.removeClass('fa-angle-right').addClass('fa-angle-down');
        }
        return t;
    };
    p.close = function () {
        var t = this;
        t.d.opened = false;
        if(t.d.subMenus.length > 0){
            t.d.$subMenuItemBox.stop().slideUp();
            t.d.$arrow.removeClass('fa-angle-down').addClass('fa-angle-right');
        }
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

    p.active = function(){
        var t = this;
        $AM.$menuItemList.find('.automizy-menu-item').removeClass('automizy-active');
        t.widget().addClass('automizy-active');
        //t.open();
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
            t.d.single = $A.parseBoolean(single);
            t.widget().toggleClass('automizy-menu-item-single', t.d.single);
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
            t.d.visibility = $A.parseBoolean(visibility || false);
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

});