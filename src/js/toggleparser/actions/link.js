/**
 * Strong action
 */

import Action from "./action.js";
import Helpers from "../helpers.js";


export default class Link extends Action {

    /**
     * Test if action
     */
    test() {
        return this.parser.selectionState.canLink;
    }

    /**
     * Off action
     */
    _off() {
        let link = Helpers.getHighestLevelNodeOfType(
            this.parser.selectionContainer, "Link" );

        let position = Helpers.getSourcePos( link );
        let contentPosition = {
            start: Helpers.getSourcePos( link.firstChild ).start,
            end: Helpers.getSourcePos( link.lastChild ).end
        };

        this.parser.editor.codemirror.replaceRange(
            "",
            contentPosition.end,
            position.end,
            "+un-link"
        );
        this.parser.editor.codemirror.replaceRange(
            "",
            position.start,
            contentPosition.start,
            "+un-link"
        );

        // Clear selection
        this.parser.editor.codemirror.setCursor(
            this.parser.currentSelection.start );

        // Focus the editor
        this.parser.editor.codemirror.focus();

        // Trigger pitch
        this.parser.pitch();

    }

    /**
     * On action
     */
    _on() {
        // console.log( "Link ON" );
    }

    /**
     * Toggle action
     */
    _toggle() {
        if ( this.parser.selectionState.isLink ) {
            this.off();
        } else {
            this.on();
        }
    }

}
