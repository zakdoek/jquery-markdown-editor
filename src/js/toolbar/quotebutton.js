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

        this.on( "click", function() {
            this.toolbar.editor.toggleParser.actions.quote.toggle();
        });

    }

    /**
     * Update override
     */
    update( selectionState ) {
        this.disable( !selectionState.canQuote );
        this.activate( selectionState.isQuote );
    }

}
