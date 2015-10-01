/**
 * Italic button definition
 */

import UpdatingButton from "./updatingbutton.js";

const OPTIONS = {
    name: "italic",
    iconClass: "jquery-markdown-editor-italic",
    title: "Italic",
    disabledInPreview: true
};

/**
 * The italic button class
 */
export default class ItalicButton extends UpdatingButton {

    /**
     * Constructor
     */
    constructor( toolbar ) {
        super( toolbar, OPTIONS );

        this.on( "click", function() {
            this.toolbar.editor.toggleParser.actions.emph.toggle();
        });
    }

    /**
     * Update override
     */
    update( selectionState ) {
        this.disable( !selectionState.canEm );
        this.activate( selectionState.isEm );
    }

}
