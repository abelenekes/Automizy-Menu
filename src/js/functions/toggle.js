define([
    "js/core/core",
    "js/elements/layout"
], function () {

    /*Toggles minimized6maximized menu*/
    $AM.toggle = function () {
        $AM.d.minimized=!$AM.d.minimized;

        if($AM.d.minimized){
            $AM.$widget.addClass('automizy-menu-minimized automizy-menu-closed');
            activateHoverAnimation();
        }
        else {
            $AM.$widget.removeClass('automizy-menu-minimized automizy-menu-closed');
            deactivateHoverAnimation();
        }
    };

    function activateHoverAnimation() {
        $AM.$menuItemListWrapper.hover(function () {
            /*On mouseover*/
            $AM.$widget.addClass("automizy-menu-opened");
            $AM.$widget.removeClass("automizy-menu-closed");
        },function () {
            /*On mouseout*/
            $AM.$widget.removeClass("automizy-menu-opened");
            $AM.$widget.addClass("automizy-menu-closed");
        });
    }

    function deactivateHoverAnimation() {
        $AM.$menuItemListWrapper.off( "mouseenter mouseleave" );
    }
});