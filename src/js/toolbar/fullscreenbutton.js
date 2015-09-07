/**
 * Fullscreen button definition
 */

import Button from "./button.js";

// button options
const OPTIONS = {
    iconClass: "jquery-markdown-editor-resize-full",
    activeIconClass: "jquery-markdown-editor-resize-small",
    title: "Fullscreen",
    activeTitle: "Exit fullscreen"
};

/**
 * Fullscreen button class
 */
export default class FullscreenButton extends Button {

    /**
     * Constructor
     */
    constructor( toolbar ) {

        super( toolbar, OPTIONS );

        let self = this;

        this.on( "click", function() {
            self.toolbar.editor.fullscreen();
        });

        this.toolbar.editor.on( "fullscreen", function() {
            self.activate( true );
        });

        this.toolbar.editor.on( "fullscreenExit", function() {
            self.activate( false );
        });

    }

}
