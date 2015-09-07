/**
 * Code button definition
 */

import UpdatingButton from "./updatingbutton.js";

// Code button options
const OPTIONS = {
    iconClass: "jquery-markdown-editor-code",
    title: "Mark as code",
    disabledInPreview: true
};

/**
 * Code button class
 */
export default class CodeButton extends UpdatingButton {

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
        /* global console */
        console.log( "Update Code Button", selectionState );
    }

}
