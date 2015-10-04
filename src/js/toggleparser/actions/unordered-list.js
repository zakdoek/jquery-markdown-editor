/**
 * Unordered list action
 */

import Action from "./action.js";
import Helpers from "../helpers.js";


export default class UnorderedList extends Action {

    /**
     * Test if action
     */
    test() {
        return this.parser.selectionState.canUl;
    }

    /**
     * Off action
     */
    _off() {
        let item = Helpers.getHighestLevelNodeOfType(
            this.parser.selectionContainer, "List" ).firstChild;

        while( item !== null ) {
            let position = Helpers.getSourcePos( item );

            this.parser.editor.codemirror.replaceRange(
                "",
                position.start,
                {
                    line: position.start.line,
                    ch: position.start.ch + 2
                },
                "+un-unordered-list"
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

        for( line = position.start.line; line <= position.end.line; line++ ) {
            this.parser.editor.codemirror.replaceRange( "- ", {
                line: line,
                ch: position.start.ch
            }, undefined, "+unordered-list" );
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
        if ( this.parser.selectionState.isUl ) {
            this.off();
        } else {
            this.on();
        }
    }

}
