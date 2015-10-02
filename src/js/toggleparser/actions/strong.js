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
            insertEnd.ch += 2;
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

        this.parser.editor.codemirror.replaceRange( "**", insertStart,
                                                    undefined, "+strong" );
        this.parser.editor.codemirror.replaceRange( "**", insertEnd,
                                                    undefined, "+strong" );

        insertStart.ch += 2;

        this.parser.editor.codemirror.setSelection( insertStart, insertEnd );

        this.parser.editor.codemirror.focus();
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
