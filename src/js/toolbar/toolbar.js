/**
 * The toolbar object
 */

import $ from "jquery";

import buttonFactory from "./buttonfactory.js";

const defaultToolbar = [
    "bold",
    "italic",
    "separator",
    "quote",
    // "code",
    "separator",
    "unorderedlist",
    "orderedlist",
    "separator",
    "link",
    "image",
    "separator",
    "preview",
    "help",
    "fullscreen"
];

/**
 * Toolbar
 */
export default class Toolbar {

    /**
     * Constructor
     *
     * $element     The element in which the toolbar will be created
     */
    constructor( editor, options ) {

        // Link the editor
        this.editor = editor;

        if ( options === true ) {
            this._options = defaultToolbar;
        } else {
            this._options = options;
        }

        // Add the element
        this.$element = $( "<div></div>" );
        this.$element.addClass( "toolbar" );

        // The buttons registry
        this._buttons = [];

        // Create toolbar element
        this._init();

        // Prepend to parent
        editor.$wrapper.prepend( this.$element );
    }

    /**
     * Create the toolbar
     */
    _init() {

        // TODO: Find better way for toolbar button creation
        let button;

        for( button of this._options ) {


            let buttonObj = buttonFactory( button, this );

            // Only add if an object is returned. Else it is a separator
            if ( buttonObj ) {
                this._buttons.push( buttonObj );
            }

        }

    }

    /**
     * Toolbar height getter
     */
    getHeight() {
        return this.$element.outerHeight();
    }

}
