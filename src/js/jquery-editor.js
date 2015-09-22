/**
 * Editor main file
 *
 * jQuery plugin
 */

import $ from "jquery";
import Editor from "./editor.js";

console.log( "SHOULD ERROR" );

$.fn.markdownEditor = function( options ) {

    if ( !$.isPlainObject( options ) ) {
        options = {};
    }

    this.each(function() {

        let $this = $( this );

        // Store this on the element
        $this.data( "__jquery-markdown-editor",
                    new Editor( $this, options ) );

    });

    return this;
};
