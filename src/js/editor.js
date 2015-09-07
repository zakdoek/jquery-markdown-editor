/**
 * The editor class
 */

import $ from "jquery";

import CodeMirror from "codemirror";
import "codemirror/addon/edit/continuelist.js";
import "codemirror/mode/xml/xml.js";
import "codemirror/mode/markdown/markdown.js";

import { toggleIfUndefined } from "./utils/helpers.js";
import EventSpawner from "./utils/eventspawner.js";
import * as defaults from "./defaults.js";
import Toolbar from "./toolbar.js";
import StatusBar from "./statusbar.js";


/**
 * The main editor class.
 */
export default class Editor extends EventSpawner {

    /**
     * The constructor
     *
     * Expects the target element, and options
     */
    constructor( $element, options ) {

        // Init the super class
        super();

        // Short circuit. A text area element is the minimum requirement
        if ( typeof $element === "undefined" || !$element.is( "textarea" ) ) {
            throw new Error( "An invalid element is passed." );
        }

        // Mix with default options
        this._options = Object.assign( {}, defaults, options );

        // Set the initial fullscreen option
        this._isFullscreen = false;

        // Set the initial preview variables
        this._isPreview = false;
        this._$previewContainer = false;

        // Will wrap all functional and source elements
        this.$wrapper = false;

        // Store the source element
        this._$element = $element;

        // Initialize the editor
        this._init();

    }

    /**
     * Initialisation
     */
    _init() {

        // Map this
        let self = this;

        // Set standard keymaps
        let keyMaps = {};
        keyMaps.Enter = "newlineAndIndentContinueMarkdownList";

        // Wrap the element
        this.$wrapper = this._$element.wrap( "<div></div>" ).parent();
        this.$wrapper.addClass( "jquery-markdown-editor" );

        // Create the codemirror object
        this.codemirror = CodeMirror.fromTextArea( this._$element.get( 0 ), {
            mode: "markdown",
            theme: "base16-light",
            tabSize: "2",
            indentWithTabs: true,
            lineNumbers: false,
            lineWrapping: true,
            autofocus: true,
            extraKeys: keyMaps
        });

        // TODO: Register cursoractivity trigger through toggleparser

        // setup toolbar
        if ( !!this._options.toolbar ) {
            this.toolbar = new Toolbar( this, this._options.toolbar );
        }

        // setup status bar
        if ( !!this._options.statusBar ) {
            this.statusBar = new StatusBar( this );
        }

        // setup fullscreen
        // Set up resizing for fullscreen stuff
        $( window ).resize(function() {
            if ( self._isFullscreen ) {
                let targetHeight = $( window ).height();
                targetHeight -= self.toolbar.getHeight();
                targetHeight -= self.statusBar.getHeight();
                self.codemirror.setSize( null, targetHeight  );
            }
        });

        // setup preview
        this._$previewContainer = $( "<div></div" );
        this._$previewContainer.addClass( "preview-container modal" );

        this._$previewContent = $( "<div></div>" );
        this._$previewContent.addClass( "content" );
        this._$previewContainer.append( this._$previewContent );

        // Add it
        $( this.codemirror.getWrapperElement() ).append(
            this._$previewContainer );

    }

    /**
     * Toggle fullscreen mode
     */
    fullscreen( bool ) {

        // Normalize
        bool = toggleIfUndefined( bool, this._isFullscreen );

        // Short circuit
        if ( this._isFullscreen === bool ) {
            return;
        }

        // Toggle state
        this._isFullscreen = bool;

        // Short circuit
        if ( this._isFullscreen ) {

            // Activate
            this.$wrapper.addClass( "fullscreen" );

            // Set editor to full size
            let targetHeight = $( window ).height();
            targetHeight -= this.toolbar.getHeight();
            targetHeight -= this.statusBar.getHeight();
            this.codemirror.setSize( null, targetHeight  );
            this.trigger( "fullscreen" );

        } else {

            // Deactivate
            this.$wrapper.removeClass( "fullscreen" );

            // Clear the size
            this.codemirror.setSize( null, "" );
            this.trigger( "fullscreenExit" );
        }
    }

    /**
     * Toggle preview mode, or set directly if bool is set
     */
    preview( bool ) {

        // Normalize
        bool = toggleIfUndefined( bool, this._isPreview );

        // Short circuit
        if ( this._isPreview === bool ) {
            return;
        }

        // Switch state
        this._isPreview = bool;

        if ( this._isPreview ) {
            // Activate preview

            // Render the current value to the preview container
            if ( !!this._options.renderer ) {
                this._$previewContent.html( this._options.renderer(
                    this.codemirror.getValue() ) );
            } else {
                this._$previewContent.text( "No renderer." );
            }

            // Set class
            this._$previewContainer.addClass( "active" );

            // Trigger event
            this.trigger( "preview" );

        } else {
            // Deactivate

            // Set class
            this._$previewContainer.removeClass( "active" );

            // Trigger event
            this.trigger( "previewExit" );

        }
    }

    /**
     * Show the help link
     */
    showHelpLink() {
        if ( !!this._options.helpLink ) {
            window.open( this._options.helpLink );
        }
    }

}
