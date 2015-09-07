/**
 * Image button definition
 */

import UpdatingButton from "./updatingbutton.js";

// Image button options
const OPTIONS = {
    iconClass: "jquery-markdown-editor-picture",
    title: "Add image",
    activeTitle: "Remove image",
    disabledInPreview: true
};

/**
 * Image button class
 */
export default class ImageButton extends UpdatingButton {

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
        console.log( "Update image Button", selectionState );
    }

}
