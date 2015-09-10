/**
 * Boldbutton definition
 */

import UpdatingButton from "./updatingbutton.js";

// Boldbutton options
const OPTIONS = {
    iconClass: "jquery-markdown-editor-bold",
    title: "Bold",
    disabledInPreview: true
};

/**
 * Boldbutton class
 */
export default class BoldButton extends UpdatingButton {

    /**
     * Constructor
     */
    constructor( toolbar ) {

        super( toolbar, OPTIONS );

    }

    /**
     * Update override
     */
    update( selectionState ) {

        this.disable( !selectionState.canStrong );
        this.activate( selectionState.isStrong );

    }

}
