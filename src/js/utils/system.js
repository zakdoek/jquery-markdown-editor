/**
 * Some system functions
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
            window.utils = window.utils || {};
            window.utils.system = factory();
        }

    })( window, function() {

        var system = {};

        return system;

    });

})();
