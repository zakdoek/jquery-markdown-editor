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

        this.on( "click", () => {
            this.toolbar.editor.preview();
        });

        // Register status update listeners
        this.toolbar.editor.on( "preview", () => {
            this.activate( true );
        });

        this.toolbar.editor.on( "previewExit", () => {
            this.activate( false );
        });

    }

}
