/**
 * Unordered list action
 */

import Action from "./action.js";
import Helpers from "../helpers.js";


export default class OrderedList extends Action {

    /**
     * Test if action
     */
    test() {
        return this.parser.selectionState.canOl;
    }

    /**
     * Off action
     */
    _off() {

        let item = Helpers.getHighestLevelNodeOfType(
            this.parser.selectionContainer, "List" ).firstChild;

        while( item !== null ) {
            let position = Helpers.getSourcePos( item );
            let startOffset = 2;
            let line = this.parser.editor.codemirror.getLine(
                position.start.line ).substr( startOffset );

            for ( let ch of line ) {
                if( ch !== " " ) {
                    break;
                }
                startOffset++;
            }

            this.parser.editor.codemirror.replaceRange(
                "",
                position.start,
                {
                    line: position.start.line,
                    ch: position.start.ch + startOffset
                },
                "+un-ordered-list"
            );

            item = item.next;
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
        let target = Helpers.getHighestLevelBlock(
            this.parser.selectionContainer );
        let position = Helpers.getSourcePos( target );

        let line;
        let count = 1;

        for( line = position.start.line; line <= position.end.line; line++ ) {
            this.parser.editor.codemirror.replaceRange( `${ count }. `, {
                line: line,
                ch: position.start.ch
            }, undefined, "+ordered-list" );
            count++;
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
        if ( this.parser.selectionState.isOl ) {
            this.off();
        } else {
            this.on();
        }
    }

}
