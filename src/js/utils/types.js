/**
 * A type test library
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
            window.utils.types = factory();
        }

    })( window, function() {

        var types = {};

        /**
         * A wrapper around typeof
         */
        types.isTypeOf = function( object, objectType ) {
            return typeof object === objectType;
        };

        /**
         * Test if an object is undefined
         */
        types.isUndefined = function( object ) {
            return types.isTypeOf( object, "undefined" );
        };

        /**
         * Test if an object is defined
         */
        types.isDefined = function( object ) {
            return !types.isUndefined( object );
        };

        return types;
    });

})();
