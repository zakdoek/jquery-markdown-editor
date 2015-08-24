/**
 * Status bar defaults
 */

define([
    "jquery",
    "app/utils/types",
    "app/statusbar/defaults"
], function( $, types, defaults ) {

    "use strict";

    /**
     * Constructor
     */
    function StatusBar( $parent, options ) {

        // Normalize options
        if ( types.isUndefined( options ) ) {
            options = {};
        }
        this._options = $.extend( defaults, options );

        // Create element
        this._$element = $( "<div></div>" );

        // Add class
        this._$element.addClass( "status-bar" );

        // Populate
        this._init();

        // Add to parent
        $parent.append( this._$element );
    }

    /**
     * Populate the status bar
     */
    StatusBar.prototype._init = function() {

        var $element;

        // Create linecount if desired
        if ( this._options.lineCount ) {
            $element = $( "<div>lines: </div>" );
            this._$lineCount = $( "<span></span>" );
            this._$lineCount.addClass( "line-count" );
            this._$lineCount.text( "0" );
            $element.append( this._$lineCount );
            this._$element.append( $element );
        }

        // Create wordcount if desired
        if ( this._options.wordCount ) {
            $element = $( "<div>words: </div>" );
            this._$wordCount = $( "<span></span>" );
            this._$wordCount.addClass( "word-count" );
            this._$wordCount.text( "0" );
            $element.append( this._$wordCount );
            this._$element.append( $element );
        }

        // Create cursor position if desired
        if ( this._options.cursorPosition ) {
            $element = $( "<div>:</div>" );
            this._$cursorLine = $( "<span></span>" );
            this._$cursorLine.addClass( "cursor-line" );
            this._$cursorLine.text( "0" );
            this._$cursorChar = $( "<span></span>" );
            this._$cursorChar.addClass( "cursor-char" );
            this._$cursorChar.text( "0" );
            $element.prepend( this._$cursorLine );
            $element.append( this._$cursorChar );
            this._$element.append( $element );
        }

    };

    /**
     * Word count setter
     */
    StatusBar.prototype.setWordCount = function( numWords ) {

        if ( this._options.lineCount ) {
            this._$lineCount.text( numWords );
        }

    };

    /**
     * Set line count
     */
    StatusBar.prototype.setLineCount = function( numLines ) {

        if ( this._options.wordCount ) {
            this._$wordCount.text( numLines );
        }

    };

    /**
     * Cursor position setter
     */
    StatusBar.prototype.setCursorPosition = function( lineNum, charNum ) {

        if ( this._options.cursorPosition ) {
            this._$cursorLine.text( lineNum );
            this._$cursorChar.text( charNum );
        }

    };

    return StatusBar;

});
