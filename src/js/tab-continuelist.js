/**
 * Add commands to continue list on tab
 */

(function() {

    "use strict";

    /**
     * inListState
     */
    function inListState( cm, pos ) {
      return cm.getStateAfter( pos.line ).list || null;
    }

    /**
     * inListOrNot
     */
    function inListOrNot( cm ) {
      var pos = cm.getCursor();
      return inListState( cm, pos );
    }

    /**
     * shiftTabAndIndentContinueMarkdownList
     */
    function shiftTabAndIndentContinueMarkdownList( cm ) {
      var inList = inListOrNot( cm );

      if( inList !== null ) {
        cm.execCommand( "insertTab" );
        return;
      }

      cm.execCommand( "indentLess" );
    }

    /**
     * tabAndIndentContinueMarkdownList
     */
    function tabAndIndentContinueMarkdownList ( cm ) {
        var inList = inListOrNot( cm );

        if( inList !== null ) {
            cm.execCommand( "insertTab" );
            return;
        }

        cm.execCommand( "indentMore" );
    }

    (function( mod ) {
        // CommonJS
        if ( typeof exports === "object" && typeof module === "object" ) {
            mod( require( "CodeMirror/lib/codemirror" ) );
        } else if ( typeof define === "function" && define.amd ) {
            // AMD
            define( [ "CodeMirror/lib/codemirror" ], mod );
        } else {
            // Plain browser env
            mod( window.CodeMirror );
        }
    })(function( CodeMirror ) {

        // Couple addon
        CodeMirror.commands.shiftTabAndIndentContinueMarkdownList =
            shiftTabAndIndentContinueMarkdownList;
        CodeMirror.commands.tabAndIndentContinueMarkdownList =
            tabAndIndentContinueMarkdownList;

    });

})();
