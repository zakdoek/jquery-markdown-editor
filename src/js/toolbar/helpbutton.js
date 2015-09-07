/**
 * Help button definition
 */

import Button from "./button.js";

// preview button options
const OPTIONS = {
    iconClass: "jquery-markdown-editor-help",
    title: "Show help"
};

/**
 * Help button class
 */
export default class HelpButton extends Button {

    /**
     * Constructor
     */
    constructor( toolbar ) {

        super( toolbar, OPTIONS );

        this.on( "click", function() {
            this.toolbar.editor.showHelpLink();
        });

    }

}
