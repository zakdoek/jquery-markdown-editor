/**
 * Linkbutton definition
 */

import UpdatingButton from "./updatingbutton.js";

// link button options
const OPTIONS = {
    iconClass: "jquery-markdown-editor-link",
    activeIconClass: "jquery-markdown-editor-unlink",
    title: "Create link",
    activeTitle: "Remove link",
    disabledInPreview: true
};

/**
 * Link button class
 */
export default class LinkButton extends UpdatingButton {

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
        this.disable( !selectionState.canLink );
        this.activate( selectionState.isLink );
    }

}
