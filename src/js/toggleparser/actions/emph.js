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
        let selection = this.parser.currentSelection;

        let insertStart = {
            line: selection.start.line,
            ch: selection.start.ch
        };

        let insertEnd = {
            line: selection.end.line,
            ch: selection.end.ch
        };

        if ( selection.start.line === selection.end.line ) {
            insertEnd.ch += 1;
        }

        // get Char after/before insert char and skip if space
        let selectionText = this.parser.editor.codemirror.getRange(
            selection.start, selection.end );

        // Forward
        for ( let selectionChar of selectionText ) {
            if ( selectionChar !== " " ) {
                break;
            }
            insertStart.ch++;
        }

        // Rewind
        for ( let sChar of selectionText.split("").reverse().join("") ) {
            if ( sChar !== " " ) {
                break;
            }
            insertEnd.ch--;
        }

        this.parser.editor.codemirror.replaceRange( "_", insertStart,
                                                    undefined, "+emph" );
        this.parser.editor.codemirror.replaceRange( "_", insertEnd,
                                                    undefined, "+emph" );

        insertStart.ch += 1;

        this.parser.editor.codemirror.setSelection( insertStart, insertEnd );

        this.parser.editor.codemirror.focus();
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
