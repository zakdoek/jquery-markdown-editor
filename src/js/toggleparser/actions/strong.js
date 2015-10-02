/**
 * Strong action
 */

import Action from "./action.js";
import Helpers from "../helpers.js";


export default class Strong extends Action {

    /**
     * Test if action
     */
    test() {
        return this.parser.selectionState.canStrong;
    }

    /**
     * Off action
     */
    _off() {

        // Remove ** or __ from container (unwrap) and adjust the selection
        // Adjusting of selection is very important when toggling!

        let strongNode = Helpers.getHighestLevelNodeOfType(
            this.parser.selectionContainer, "Strong" );
        let position = Helpers.getSourcePos( strongNode );

        let startCharStart = {
            line: position.start.line,
            ch: position.start.ch
        };

        let startCharEnd = {
            line: position.start.line,
            ch: position.start.ch + 2
        };

        let endCharStart = {
            line: position.end.line,
            ch: position.end.ch
        };

        let endCharEnd = {
            line: position.end.line,
            ch: position.end.ch - 2
        };

        if ( position.start.line === position.end.line ) {
            endCharStart.ch -= 2;
            endCharEnd.ch -= 2;
        }

        // Remove
        this.parser.editor.codemirror.replaceRange( "",
                                                    startCharStart,
                                                    startCharEnd,
                                                    "+un-strong" );
        this.parser.editor.codemirror.replaceRange( "",
                                                    endCharStart,
                                                    endCharEnd,
                                                    "+un-strong" );

        // Clear selection
        this.parser.editor.codemirror.setCursor(
            this.parser.currentSelection.start );

        // Focus the editor
        this.parser.editor.codemirror.focus();

    }

    /**
     * On action
     */
    _on() {
        /* global console */
        console.log( "Wrap in strong" );
    }

    /**
     * Toggle action
     */
    _toggle() {
        if ( this.parser.selectionState.isStrong ) {
            this.off();
        } else {
            this.on();
        }
    }

}
