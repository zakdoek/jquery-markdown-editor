/**
 * Ordered list button definition
 */

import UpdatingButton from "./updatingbutton.js";

// unordered list button options
const OPTIONS = {
    iconClass: "jquery-markdown-editor-list-numbered",
    title: "Ordered list",
    disabledInPreview: true
};

/**
 * Ordered list button class
 */
export default class OrderedListButton extends UpdatingButton {

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
        this.disable( !selectionState.canOl );
        this.activate( selectionState.isOl );
    }

}
