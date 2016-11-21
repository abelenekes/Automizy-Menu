define([
    "js/core/core",
    "js/core/pluginLoader",
    "js/events/pluginsLoaded"
], function () {
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
});