/**
 * Defines the toggleparser
 */

import { Parser } from "commonmark";
import Helpers from "./helpers.js";
import PitcherCollection from "./threaded-pitcher-collection.js";


/**
 * ToggleParser
 */
export default class ToggleParser {

    /**
     * Constructor
     */
    constructor( editor ) {

        this.editor = editor;

        this._parser = new Parser();

        this._astTreeBuffer = null;
        this._selectionStateBuffer = null;
        this._containingSelectionBuffer = null;

        // Create pitchers
        this._pitcherCollection = new PitcherCollection( this );

        // Add listener for value update
        this.editor.codemirror.on( "update", () => {
            // Invalidate ast tree
            this._astTreeBuffer = null;
        });

        // Add listener for selection state update
        this.editor.codemirror.on( "cursorActivity", () => {
            // Selection changed, invalidate states
            this._containingSelectionBuffer = null;

            // Trigger
            this._pitcherCollection.pitch();
        });

        this._pitcherCollection.on( "pitched", ( state ) => {
            // Set the state
            this._selectionStateBuffer = state;

            // Trigger update
            this._updateSelectionState();
        });

        // Do initial pitch
        this._pitcherCollection.pitch();

    }

    /**
     * Trigger the selection state
     */
    _updateSelectionState() {
        this.editor.trigger( "selectionStateChange", this._selectionState );
    }

    /**
     * Toggle bold
     */
    toggleStrong() {
        let state = this._selectionState;
        if ( !state.canStrong ) {
            return;
        }

        if ( state.isStrong ) {
            // Set off
            let strongNode = Helpers.getHighestLevelNodeOfType(
                this._selectionContainer, "Strong" );
            let strongPos = Helpers.getSourcePos( strongNode );
            let strongPosEnd = {
                start: {
                    line: strongPos.start.line,
                    ch: strongPos.start.ch + 2
                },
                end: {
                    line: strongPos.end.line,
                    ch: strongPos.end.ch - 4
                }
            };

            strongPos.end.ch -= 2;

            this.editor.codemirror.replaceRange( "", strongPos.start,
                                                 strongPosEnd.start );
            this.editor.codemirror.replaceRange( "", strongPosEnd.end,
                                                 strongPos.end );
        } else {
            // Set on
            let selection = this.currentSelection;
            this.editor.codemirror.replaceRange( "**", selection.end );
            this.editor.codemirror.replaceRange( "**", selection.start );
        }

        this._astTreeBuffer = null;
        this._selectionStateBuffer = null;
        this._containingSelectionBuffer = null;
        this._updateSelectionState();
    }

    /**
     * Toggle em
     */
    toggleEm() {
        let state = this._selectionState;
        if ( !state.canEm ) {
            return;
        }

        if ( state.isEm ) {
            // Set off
            let emNode = Helpers.getHighestLevelNodeOfType(
                this._selectionContainer, "Emph" );
            let emPos = Helpers.getSourcePos( emNode );
            let emPosEnd = {
                start: {
                    line: emPos.start.line,
                    ch: emPos.start.ch + 1
                },
                end: {
                    line: emPos.end.line,
                    ch: emPos.end.ch - 2
                }
            };

            emPos.end.ch -= 1;

            this.editor.codemirror.replaceRange( "", emPos.start,
                                                 emPosEnd.start );
            this.editor.codemirror.replaceRange( "", emPosEnd.end, emPos.end );
        } else {
            // Set on
            let selection = this.currentSelection;
            this.editor.codemirror.replaceRange( "_", selection.end );
            this.editor.codemirror.replaceRange( "_", selection.start );
        }

        this._astTreeBuffer = null;
        this._selectionStateBuffer = null;
        this._containingSelectionBuffer = null;
        this._updateSelectionState();
    }

    /**
     * Get the ast tree
     */
    get astTree() {
        if ( this._astTreeBuffer === null ) {
            this._astTreeBuffer = this._parser.parse( this.editor.value );
        }
        return this._astTreeBuffer;
    }

    /**
     * Get the current selection
     */
    get currentSelection() {

        let self = this;

        return {
            start: self.editor.codemirror.getCursor( "from" ),
            end: self.editor.codemirror.getCursor( "to" )
        };
    }

    /**
     * Get the containing node of a current selection
     */
    get _selectionContainer() {

        if ( this._containingSelectionBuffer === null ) {

            // Set last succesful zoom on node
            this._containingSelectionBuffer = Helpers.getSelectionContainer(
                this.currentSelection, this.astTree );

        }

        return this._containingSelectionBuffer;
    }

    /**
     * Fetch a selection state object
     */
    get _selectionState() {
        return this._selectionStateBuffer;
    }
}
