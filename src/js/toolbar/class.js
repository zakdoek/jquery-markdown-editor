/**
 * The toolbar object
 */

define([
    "jquery",
    "app/utils/types",
    "app/toolbar/defaults"
], function( $, types, defaults ) {

    "use strict";

    /**
     * Constructor
     *
     * $element     The element in which the toolbar will be created
     */
    function Toolbar( $element, definitions ) {

        // Normalize the options
        if ( types.isUndefined( definitions ) ) {
            definitions = defaults;
        }

        // Add the element
        this._$element = $element;

        // The item registry
        this._registry = {};

        // Create toolbar element
        this._init( definitions );

        // Action listeners register
        this._actionListeners = [];
    }

    /**
     * Create the toolbar
     */
    Toolbar.prototype._init = function( definitions ) {

        // Expose to child scope
        var self = this;

        $.each( definitions, function( idx, value ) {

            var $icon;

            if ( value ) {
                // Add actual icon
                $icon = $( "<a></a>" );

                // Add the icon class
                $icon.addClass( value.iconClass );

                // Add the title
                $icon.attr( "title", value.title );

                // Register handler
                $icon.click(function() {
                    self._triggerListeners( value.name );
                });

                // Add to registry
                value.$element = $icon;
                value.isActive = false;
                self._registry[ value.name ] = value;

            } else {
                // Add a separator
                $icon = $( "<i>|</i>" );
                $icon.addClass( "separator" );
            }

            self._$element.append( $icon );

        });
    };

    /**
     * Triggers listeners
     */
    Toolbar.prototype._triggerListeners = function( buttonId ) {

        // Expand scope
        var self = this;

        // Call all listeners
        $.each( this._actionListeners, function( idx, value ) {
            value.call( self, buttonId );
        });
    };

    /**
     * Get the button data
     */
    Toolbar.prototype._getData = function( buttonId ) {
        return this._registry[ buttonId ];
    };

    /**
     * Register a toolbar action listener.
     *
     * A callback that in the following form:
     *
     * function ( buttonId ) {
     *
     * }
     *
     * For example, the fullscreen button when not in fullscreen mode:
     *  buttonId = "fullscreen"
     */
    Toolbar.prototype.addActionListener = function( callback ) {
        this._actionListeners.push( callback );
    };

    /**
     * Set a button to active
     */
    Toolbar.prototype.markActive = function( buttonId ) {
        var data = this._getData( buttonId );

        // Short circuit
        if ( data.isActive ) {
            return;
        }

        // Add active class if applicable
        if ( types.isDefined( data.activeIconClass ) ) {
            data.$element.addClass( data.activeIconClass )
                         .removeClass( data.iconClass );
        }

        // Add active title if applicable
        if ( types.isDefined( data.activeTitle ) ) {
            data.$element.attr( "title", data.activeTitle );
        }

        // Mark as active
        data.isActive = true;
    };

    /**
     * Set a button to not active
     */
    Toolbar.prototype.markNotActive = function( buttonId ) {
        var data = this._getData( buttonId );

        // Short circuit
        if ( !data.isActive ) {
            return;
        }

        // Strip active icon if applicable and restore regular class
        if ( types.isDefined( data.activeIconClass ) ) {
            data.$element.addClass( data.iconClass )
                         .removeClass( data.activeIconClass );
        }

        // Strip active title if applicable and restore regular title
        if ( types.isDefined( data.activeTitle ) ) {
            data.$element.attr( "title", data.title );
        }

        // Mark as not active
        data.isActive = false;
    };

    return Toolbar;

});
