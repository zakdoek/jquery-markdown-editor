/**
 * Defines the toggleparser
 */

import { Parser } from "commonmark";

import Helpers from "./helpers.js";
import PitcherCollection from "./threaded-pitcher-collection.js";
import ActionsLibrary from "./action-library.js";


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

        // Load actions
        this.actions = new ActionsLibrary( this );

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
        this.editor.trigger( "selectionStateChange", this.selectionState );
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
    get selectionContainer() {

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
    get selectionState() {
        return this._selectionStateBuffer;
    }
}
