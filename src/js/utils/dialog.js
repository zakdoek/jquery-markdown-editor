/**
 * A dialog.
 *
 * - Is able to spawn events.
 * - Can be closed (optional)
 */

import EventSpawner from "./eventspawner.js";

// Default options
const DEFAULT_OPTIONS = {
    className: "generic-dialog"
};


/**
 * Dialog class
 */
export default class Dialog extends EventSpawner {

    /**
     * The constructor
     */
    constructor( editor, options = {} ) {
        // Init super
        super();

        this.editor = editor;
        this._options = Object.assign( {}, options, DEFAULT_OPTIONS );

        this._$dialogElement = $( `
            <div class="${ this._options.className + " " }modal">
                <div class="content"></div>
            </div>
        ` ).appendTo( this.editor.codemirror.getWrapperElement() );
    }

    /**
     * Open the dialog
     *
     * Notify
     */
    open() {
        // Trigger opened
    }

    /**
     * Close the dialog
     */
    close() {
        // Trigger closed
    }

}
