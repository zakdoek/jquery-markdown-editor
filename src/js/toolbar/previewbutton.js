/**
 * Preview button definition
 */

import Button from "./button.js";

// preview button options
const OPTIONS = {
    iconClass: "jquery-markdown-editor-eye",
    activeIconClass: "jquery-markdown-editor-eye-off",
    title: "Preview",
    activeTitle: "Exit preview"
};

/**
 * Link button class
 */
export default class PreviewButton extends Button {

    /**
     * Constructor
     */
    constructor( toolbar ) {

        super( toolbar, OPTIONS );

        let self = this;

        this.on( "click", function() {
            this.toolbar.editor.preview();
        });

        // Register status update listeners
        this.toolbar.editor.on( "preview", function() {
            self.activate( true );
        });

        this.toolbar.editor.on( "previewExit", function() {
            self.activate( false );
        });

    }

}
