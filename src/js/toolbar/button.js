/**
 * Defines a toolbar button
 */

import $ from "jquery";

import { toggleIfUndefined } from "../utils/helpers.js";
import EventSpawner from "../utils/eventspawner.js";

const ACTIVE_CLASS = "active";

const defaults = {
    iconClass: false,
    activeIconClass: false,
    title: false,
    activeTitle: false,
    disabledInPreview: false
};

/**
 * A button, for use in a toolbar
 */
export default class Button extends EventSpawner {

    /**
     * The constructor
     */
    constructor( toolbar, options ) {

        // Initialize the event spawner
        super();

        // Register the toolbar
        this.toolbar = toolbar;

        // Merge options with default
        this._options = Object.assign( {} , defaults, options );

        // Set state variables
        this._isActive = false;
        this._isDisabled = false;

        // Create the button
        this._init();

    }

    /**
     * Create the button
     */
    _init() {

        // Create the element
        this.$element = $( "<a></a>" );

        // Add class if neccesary
        if ( this._options.iconClass ) {
            this.$element.addClass( this._options.iconClass );
        }

        // Add title
        if ( this._options.title ) {
            this.$element.attr( "title", this._options.title );
        }

        // Register the click
        this.$element.click(() => {
            this.trigger( "click" );
        });

        // Try to register disabling for preview msg
        if ( this._options.disabledInPreview ) {
            this._prePreviewState = null;
            this.toolbar.editor.on( "preview", () => {
                // Store pre preview state
                if ( this._prePreviewState === null ) {
                    this._prePreviewState = this._isDisabled;
                }
                this.disable( true );
            });
            this.toolbar.editor.on( "previewExit", () => {
                // Restore pre preview state
                if ( this._prePreviewState !== null ) {
                    this.disable( this._prePreviewState );
                    this._prePreviewState = null;
                } else {
                    this.disable( false );
                }
            });
        }

        // Add the button
        this.toolbar.$element.append( this.$element );
    }

    /**
     * Activate the button
     */
    activate( bool ) {

        // Normalize
        bool = toggleIfUndefined( bool, this._isActive );

        // Short circuit
        if ( bool === this._isActive ) {
            return;
        }

        if ( bool ) {
            // Enter active state

            // Icon change if desired
            if ( this._options.activeIconClass ) {
                this.$element.addClass( this._options.activeIconClass );
            }

            // Title change if desired
            if ( this._options.activeTitle ) {
                this.$element.attr( "title", this._options.activeTitle );
            }

            // Tag as active
            this.$element.addClass( ACTIVE_CLASS );

            // Set the state
            this._isActive = true;

        } else {
            // Exit active state

            // Icon change if desired
            if ( this._options.iconClass && this._options.activeIconClass ) {
                this.$element.removeClass( this._options.activeIconClass );
            }

            // Title change if desired
            if ( this._options.activeTitle ) {
                if ( this._options.title ) {
                    this.$element.attr( "title", this._options.title );
                } else {
                    this.$element.removeAttr( "title" );
                }
            }

            // Remove active tag
            this.$element.removeClass( ACTIVE_CLASS );

            // Set the state
            this._isActive = false;

        }
    }

    /**
     * Disable
     */
    disable( bool ) {

        // Normalize
        bool = toggleIfUndefined( bool, this._isDisabled );

        // Short circuit
        if ( this._isDisabled === bool ) {
            return;
        }

        if ( bool ) {
            // Disable
            this.$element.addClass( "disabled" );
        } else {
            // Enable
            this.$element.removeClass( "disabled" );
        }

        this._isDisabled = bool;
    }

}
