/**
 * Editor main file
 */

(function() {

    "use strict";

    ( function( window, factory ) {

        // universal module definition

         /*global define: false, module: false, require: false */

     if ( typeof define === "function" && define.amd ) {
         // AMD
         define( [
             "jquery",
             "./editor"
         ], function( $, MarkdownEditor ) {
             return factory( $, MarkdownEditor );
         });
     } else if ( typeof exports === "object" ) {
         // CommonJS
         module.exports = factory(
             require( "jquery" ),
             require( "./editor" )
         );
     } else {
         // browser global
         factory( window.jQuery, window.MarkdownEditor );
     }

    })( window, function( $, MarkdownEditor ) {

        $.fn.markdownEditor = function( options ) {

            if ( typeof options !== "object" ) {
                options = {};
            }

            this.each(function() {

                options.element = this;

                $( this ).data( "markdown-editor-obj",
                           new MarkdownEditor( options ) );

            });

            return this;
        };

    });

})();
