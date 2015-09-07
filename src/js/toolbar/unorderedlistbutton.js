/**
 * Unordered list button definition
 */

import UpdatingButton from "./updatingbutton.js";

// unordered list button options
const OPTIONS = {
    iconClass: "jquery-markdown-editor-list-bullet",
    title: "Unordered list",
    disabledInPreview: true
};

/**
 * Unordered list button class
 */
export default class UnorderedListButton extends UpdatingButton {

    /**
     * Constructor
     */
    constructor( toolbar ) {

        super( toolbar, OPTIONS );

    }

}
