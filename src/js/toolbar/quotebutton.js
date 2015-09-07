/**
 * Quote button definition
 */

import UpdatingButton from "./updatingbutton.js";

// quote button options
const OPTIONS = {
    iconClass: "jquery-markdown-editor-quote-left",
    title: "Quote",
    activeTitle: "Unquote",
    disabledInPreview: true
};

/**
 * Quote button class
 */
export default class QuoteButton extends UpdatingButton {

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
        console.log( "Update Quote Button", selectionState );
    }

}
