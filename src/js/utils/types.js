/**
 * A type test library
 */

define([], function() {

    "use strict";

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
