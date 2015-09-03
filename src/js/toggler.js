/**
 * Editor defaults
 */

(function() {

    "use strict";

    ( function( window, factory ) {

        // universal module definition

        /*global define: false, module: false */

        if ( typeof define === "function" && define.amd ) {
            // AMD
            define( [
            ], function() {
                return factory();
            });
        } else if ( typeof exports === "object" ) {
            // CommonJS
            module.exports = factory();
        } else {
            // browser global
            window.jqueryMarkdownEditor = window.jqueryMarkdownEditor || {};
            window.jqueryMarkdownEditor.defaults = factory();
        }

    })( window, function() {

        /**
         * Should return a library that helps parsing and togglling selections.
         * Will only support 1 block at a time selection
         *
         * Recognise:
         *  - lists
         *  - image
         *  - links
         *  - strong
         *  - emphasis
         *
         *  Parse the block into tokens with line and number, so it can be
         *  matched against a selection.
         *
         *  A token is the start and end marking. Interpretation of the tokens
         *  will be different.
         */
        return {};

    });

})();
