/**
 * A button that handles updates through an update method
 */

import Button from "./button.js";


/**
 * The class
 */
export default class UpdatingButton extends Button {

    /**
     * Constructor
     */
    constructor( toolbar, options ) {

        super( toolbar, options );

        let self = this;

        // Register binding on the editor
        this.toolbar.editor.on( "selectionStateChange",
                                function( selectionState ) {
            self.update( selectionState );
        });

    }

    /**
     * Update the button, based on a selection object
     */
    update( selectionState ) {
        /* global console */
        console.log( selectionState );
    }

}