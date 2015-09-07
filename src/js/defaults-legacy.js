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
                "marked/lib/marked"
            ], function( marked ) {
                return factory( marked );
            });
        } else if ( typeof exports === "object" ) {
            // CommonJS
            module.exports = factory(
                require( "marked/lib/marked" )
            );
        } else {
            // browser global
            window.jqueryMarkdownEditor = window.jqueryMarkdownEditor || {};
            window.jqueryMarkdownEditor.defaults = factory(
                window.marked
            );
        }

    })( window, function( marked ) {

        return {
            helpLink: "http://nextstepwebs.github.io/" +
                      "simplemde-markdown-editor/markdown-guide",
            renderer: marked
        };
    });

})();
