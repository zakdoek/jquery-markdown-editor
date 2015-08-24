/**
 * StatusBar defaults
 */

(function() {

    "use strict";

    ( function( window, factory ) {

        // universal module definition

        /*global define: false, module: false */

        if ( typeof define === "function" && define.amd ) {
            // AMD
            define( [], function() {
                return factory();
            });
        } else if ( typeof exports === "object" ) {
            // CommonJS
            module.exports = factory();
        } else {
            // browser global
            window.statusBar = window.statusBar || {};
            window.statusBar.defaults = factory();
        }

    })( window, function() {

        return {
            lineCount: true,
            wordCount: true,
            cursorPosition: true
        };
    });

})();
