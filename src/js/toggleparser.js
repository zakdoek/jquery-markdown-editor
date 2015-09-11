/**
 * Defines the toggleparser
 */

import { Parser } from "commonmark";

// State prototype
const defaultSelectionState = {

    // Check the validity of the selection
    canStrong: false,
    canEm: false,
    canQuote: false,
    canCode: false,
    canUl: false,
    canOl: false,
    canLink: false,
    canImage: false,

    // Check the value of the selection
    isStrong: false,
    isEm: false,
    isQuote: false,
    isCode: false,
    isUl: false,
    isOl: false,
    isLink: false,
    isImage: false

};


/**
 * ToggleParser
 */
export default class ToggleParser {

    /**
     * Constructor
     */
    constructor( editor ) {

        let self = this;

        this.editor = editor;

        this._parser = new Parser();

        this._astTreeBuffer = null;

        // Add listener for value update
        this.editor.codemirror.on( "update", function() {
            self._astTreeBuffer = null;
        });

        // Add listener for selection state update
        this.editor.codemirror.on( "cursorActivity", function() {
            self.updateSelectionState();
        });

    }

    /**
     * Trigger the selection state
     */
    updateSelectionState() {
        this.editor.trigger( "selectionStateChange", this._selectionState );
    }

    /**
     * Try to zoom a level
     *
     * Returns child node if zoom was succesfull, false otherwise.
     *
     * A zoom works like this:
     *
     * Scan the children of the node.
     *
     * If a child is a container, test if it contains the selection. If it
     * does, return the child. Else, go to the next child for testing.
     *
     * Also throw in some optimisation. If the child is a container but starts
     * beyond the selection, one can safely assume the following selections
     * will not match. Therefore, return false directly.
     *
     * Return false if no child could be tested.
     */
    _tryLevelZoom( node, selection ) {

        // Populate initial child
        let child = node.firstChild;

        while( child !== null ) {

            // Only scan containers
            if ( child.isContainer ) {
                // Perform tests
                // Start of selection should be greater than child span
                // End of selection should be lesser than child span

                // Convenience variables
                let childSourceRange = ToggleParser._getSourcePos( child );
                let compChildSelectionStart = ToggleParser._cursorCompare(
                    childSourceRange.start, selection.start );
                let compChildSelectionEnd = ToggleParser._cursorCompare(
                    childSourceRange.end, selection.end );

                // Test for hit
                // child Start should be less or equal than selection start
                // child End should be greater or equal than selection end
                if ( compChildSelectionStart <= 0 &&
                     compChildSelectionEnd >= 0) {
                    return child;
                }

                // Test if further walking is futile
                // child start should be greater than selection start
                // Short circuit
                if ( compChildSelectionStart === 1 ) {
                    return false;
                }
            }

            // Select the next for scanning
            child = child.next;
        }

        // Nothing found, return false
        return false;
    }

    /**
     * Get the ast tree
     */
    get _astTree() {
        if ( this._astTreeBuffer === null ) {
            this._astTreeBuffer = this._parser.parse( this.editor.value );
        }
        return this._astTreeBuffer;
    }

    /**
     * Get the current selection
     */
    get _currentSelection() {

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
        let selection = this._currentSelection;
        let node = this._astTree;
        let attempt = this._tryLevelZoom( node, selection );

        while( attempt ) {

            // Attempt is true, so set to node
            node = attempt;

            // New attempt
            attempt = this._tryLevelZoom( node, selection );

        }

        // Return last succesful zoom on node
        return node;
    }

    /**
     * Fetch a selection state object
     */
    get _selectionState() {

        let state = Object.assign( {}, defaultSelectionState );

        let selection = this._selectionContainer;

        /* global console */
        console.log( selection.type, ToggleParser._getSourcePos( selection ) );

        return state;
    }

    /**
     * Compares cursors
     *
     * Return 0 if a equals b
     * Return -1 if a is less than b
     * Return 1 if a is greater than b
     */
    static _cursorCompare( a, b ) {
        if ( a.line === b.line && a.ch === b.ch ) {
            return 0;
        }

        if ( a.line > b.line || ( a.line === b.line && a.ch > b.ch ) ) {
            return 1;
        }

        return -1;
    }

    /**
     * Get the source positions from node
     */
    static _getSourcePos( node ) {
        let sourcepos = node.sourcepos;

        if ( typeof node.sourcepos === "undefined" ) {
            // Fill with source pos.
            if ( typeof node._extraSourcepos === "undefined" ) {
                ToggleParser._innerPopulateSourcePos(
                    node.parent,
                    node.parent.sourcepos[ 0 ][ 0 ],
                    node.parent.sourcepos[ 0 ][ 1 ]);
            }
            sourcepos = node._extraSourcepos;
        }

        return {
            start: {
                line: sourcepos[ 0 ][ 0 ] - 1,
                ch: sourcepos[ 0 ][ 1 ] - 1
            },
            end: {
                line: sourcepos[ 1 ][ 0 ] - 1,
                ch: sourcepos[ 1 ][ 1 ]
            }
        };
    }

    /**
     * Inner populate
     */
    static _innerPopulateSourcePos( node, currentLine, currentChar ) {

        let startCurrentLine = currentLine;
        let startCurrentChar = currentChar;

        if ( node.isContainer ) {

            let addChars = 0;
            if ( node.type === "Strong" ) {
                addChars = 2;
            } else if ( node.type === "Emph" ) {
                addChars = 1;
            } else if ( node.type === "Code" ) {
                addChars = 3;
            } else if ( node.type === "Link" ) {
                currentChar += 1;
            } else if ( node.type === "Image" ) {
                currentChar += 2;
            }

            currentChar += addChars;

            let child = node.firstChild;

            while( child ) {
                ToggleParser._innerPopulateSourcePos( child, currentLine,
                                                      currentChar );
                currentLine = child._extraSourcepos[ 1 ][ 0 ];
                // + 2 is compensation for return - 2
                currentChar = child._extraSourcepos[ 1 ][ 1 ] + 1;
                child = child.next;
            }

            if ( node.type === "Link" || node.type === "Image" ) {
                // Plus closing char and link chars
                currentChar += node.destination.length + 3;
            }

            currentChar += addChars;
        } else if ( node.type === "Softbreak" || node.type === "Hardbreak" ) {
            currentLine += 1;
            currentChar = 1;
        } else {
            currentChar += node.literal.length;
        }

        node._extraSourcepos = [
            [ startCurrentLine, startCurrentChar ],
            [ currentLine, currentChar - 1 ]
        ];
    }

}
