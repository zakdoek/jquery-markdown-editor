/**
 * Quote action
 */

import Action from "./action.js";
import Helpers from "../helpers.js";


export default class Quote extends Action {

    /**
     * Test if action
     */
    test() {
        return this.parser.selectionState.canQuote;
    }

    /**
     * Off action
     */
    _off() {
        let blockQuote = Helpers.getHighestLevelNodeOfType(
            this.parser.selectionContainer, "BlockQuote" );
        let position = Helpers.getSourcePos( blockQuote );
        let fromCh = position.start.ch;
        let toCh = fromCh + 2;

        for ( let i = position.start.line; i <= position.end.line; i++ ) {
            this.parser.editor.codemirror.replaceRange( "", {
                line: i,
                ch: fromCh
            }, {
                line: i,
                ch: toCh
            }, "+un-quote" );
        }

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
        let subject = Helpers.getHighestLevelBlock(
            this.parser.selectionContainer );
        let position = Helpers.getSourcePos( subject );
        let fromCh = position.start.ch;

        for ( let i = position.start.line; i <= position.end.line; i++ ) {
            this.parser.editor.codemirror.replaceRange( "> ", {
                line: i,
                ch: fromCh
            }, undefined, "+quote" );
        }

        // Clear selection
        this.parser.editor.codemirror.setCursor(
            this.parser.currentSelection.start );

        // Focus the editor
        this.parser.editor.codemirror.focus();

        // Trigger pitch
        this.parser.pitch();
    }

    /**
     * Toggle action
     */
    _toggle() {
        if ( this.parser.selectionState.isQuote ) {
            this.off();
        } else {
            this.on();
        }
    }

}
