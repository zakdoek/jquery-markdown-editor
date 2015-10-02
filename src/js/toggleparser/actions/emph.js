/**
 * Emphasis action
 */

import Action from "./action.js";
import Helpers from "../helpers.js";


export default class Emph extends Action {

    /**
     * Test if any action is possible at all
     */
    test() {
        return this.parser.selectionState.canEm;
    }

    /**
     * Off action
     */
    _off() {
        // Remove * or _ from container (unwrap) and adjust the selection
        // Adjusting of selection is very important when toggling!

        let emphNode = Helpers.getHighestLevelNodeOfType(
            this.parser.selectionContainer, "Emph" );
        let position = Helpers.getSourcePos( emphNode );

        let startCharStart = {
            line: position.start.line,
            ch: position.start.ch
        };

        let startCharEnd = {
            line: position.start.line,
            ch: position.start.ch + 1
        };

        let endCharStart = {
            line: position.end.line,
            ch: position.end.ch
        };

        let endCharEnd = {
            line: position.end.line,
            ch: position.end.ch - 1
        };

        if ( position.start.line === position.end.line ) {
            endCharStart.ch -= 1;
            endCharEnd.ch -= 1;
        }

        // Remove
        this.parser.editor.codemirror.replaceRange( "",
                                                    startCharStart,
                                                    startCharEnd,
                                                    "+un-emph" );
        this.parser.editor.codemirror.replaceRange( "",
                                                    endCharStart,
                                                    endCharEnd,
                                                    "+un-emph" );

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
        console.log( "Wrap in em" );
    }

    /**
     * Toggle action
     */
    _toggle() {
        if ( this.parser.selectionState.isEm ) {
            this.off();
        } else {
            this.on();
        }
    }

}
