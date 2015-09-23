/**
 * Status bar defaults
 */

import $ from "jquery";

/**
 * Wordcount finder
 */
const WORDCOUNT_PATTERN = new RegExp( "[a-zA-Z0-9_\\u0392-\\u03c9]+|" +
                                      "[\\u4E00-\\u9FFF\\u3400-\\u4dbf" +
                                      "\\uf900-\\ufaff\\u3040-\\u309f" +
                                      "\\uac00-\\ud7af]+", "g" );

/**
 * The statusbar object
 */
export default class StatusBar {

    /**
     * Constructor
     */
    constructor( editor ) {

        // Map the editor
        this._editor = editor;

        // Create element
        this._$element = $( "<div></div>" );

        // Add class
        this._$element.addClass( "status-bar" );

        // Populate
        this._init();

        // Add to parent
        editor.$wrapper.append( this._$element );
    }

    /**
     * Populate the status bar
     */
    _init() {

        let $element;
        // Create linecount if desired
        $element = $( "<div>lines: </div>" );
        $element.addClass( "status-block line-status" );
        this._$lineCount = $( "<span></span>" );
        this._$lineCount.addClass( "line-count" );
        this._$lineCount.text( "0" );
        $element.append( this._$lineCount );
        this._$element.append( $element );

        // Create wordcount if desired
        $element = $( "<div>words: </div>" );
        $element.addClass( "status-block word-status" );
        this._$wordCount = $( "<span></span>" );
        this._$wordCount.addClass( "word-count" );
        this._$wordCount.text( "0" );
        $element.append( this._$wordCount );
        this._$element.append( $element );

        // Create cursor position if desired
        $element = $( "<div>:</div>" );
        $element.addClass( "status-block cursor-status" );
        this._$cursorLine = $( "<span></span>" );
        this._$cursorLine.addClass( "cursor-line" );
        this._$cursorLine.text( "0" );
        this._$cursorChar = $( "<span></span>" );
        this._$cursorChar.addClass( "cursor-char" );
        this._$cursorChar.text( "0" );
        $element.prepend( this._$cursorLine );
        $element.append( this._$cursorChar );
        this._$element.append( $element );

        // Add codemirror listeners
        this._editor.codemirror.on( "update", () => {
            // Update line count
            this._$lineCount.text( this._editor.codemirror.lineCount() );

            // Update word count
            this._$wordCount.text( this._getWordCount() );

        });

        this._editor.codemirror.on( "cursorActivity", () => {
            // Update cursor position
            let pos = this._editor.codemirror.getCursor( "from" );
            this._$cursorLine.text( pos.line );
            this._$cursorChar.text( pos.ch );
        });

    }

    /**
     * Get the wordcount from the codemirror object
     */
    _getWordCount() {
        let data = this._editor.codemirror.getValue();
        let matches = data.match( WORDCOUNT_PATTERN );
        let count = 0;

        if( matches === null ) {
            return count;
        }
        matches.forEach( match => {
            if ( match.charCodeAt( 0 ) >= 0x4E00 ) {
                count += match.length;
            } else {
                count += 1;
            }
        });
        return count;
    }

    /**
     * Height getter
     */
    getHeight() {
        return this._$element.outerHeight();
    }

}
