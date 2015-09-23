/**
 * Defines the toggleparser
 */

import { Parser } from "commonmark";

// Inline list
const INLINES = new Set([
    "Text",
    "Softbreak",
    "Hardbreak",
    "Emph",
    "Strong",
    "Html",
    "Link",
    "Image",
    "Code"
]);

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

        this.editor = editor;

        this._parser = new Parser();

        this._astTreeBuffer = null;
        this._selectionStateBuffer = null;
        this._containingSelectionBuffer = null;

        // Add listener for value update
        this.editor.codemirror.on( "update", () => {
            // Invalidate ast tree
            this._astTreeBuffer = null;
        });

        // Add listener for selection state update
        this.editor.codemirror.on( "cursorActivity", () => {
            // Selection changed, invalidate states
            this._selectionStateBuffer = null;
            this._containingSelectionBuffer = null;

            // Update
            this.updateSelectionState();
        });

    }

    /**
     * Trigger the selection state
     */
    updateSelectionState() {
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
            let strongNode = ToggleParser._getHighestLevelNodeOfType(
                this._selectionContainer, "Strong" );
            let strongPos = ToggleParser._getSourcePos( strongNode );
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
            let selection = this._currentSelection;
            this.editor.codemirror.replaceRange( "**", selection.end );
            this.editor.codemirror.replaceRange( "**", selection.start );
        }

        this._astTreeBuffer = null;
        this._selectionStateBuffer = null;
        this._containingSelectionBuffer = null;
        this.updateSelectionState();
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
            let emNode = ToggleParser._getHighestLevelNodeOfType(
                this._selectionContainer, "Emph" );
            let emPos = ToggleParser._getSourcePos( emNode );
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
            let selection = this._currentSelection;
            this.editor.codemirror.replaceRange( "_", selection.end );
            this.editor.codemirror.replaceRange( "_", selection.start );
        }

        this._astTreeBuffer = null;
        this._selectionStateBuffer = null;
        this._containingSelectionBuffer = null;
        this.updateSelectionState();
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

        if ( this._containingSelectionBuffer === null ) {

            let selection = this._currentSelection;
            let node = this._astTree;
            let attempt = this._tryLevelZoom( node, selection );

            while( attempt ) {

                // Attempt is true, so set to node
                node = attempt;

                // New attempt
                attempt = this._tryLevelZoom( node, selection );

            }

            // Set last succesful zoom on node
            this._containingSelectionBuffer = node;

        }

        return this._containingSelectionBuffer;
    }

    /**
     * Pitch for bold
     */
    _pitchStrong( state, selection ) {
        state.isStrong = ToggleParser._isOfTypeOrAncestors( selection,
                                                            "Strong", true );

        // If self or ancestor is strong, can unstrong toggle, so permit true.
        if ( state.isStrong ) {
            state.canStrong = true;
            // Early exit
            return;
        }

        // Shortcircuit on invalid blocks
        if ( selection.type === "Image" || selection.type === "Link" ) {
            state.canStrong = false;
            return;
        }

        // Detect multiblock selection
        if ( !ToggleParser._isHighestLevelBlock( selection ) ) {
            state.canStrong = false;
            return;
        }

        // An empty selection has no use here
        if ( this._selectionIsEmpty() ) {
            state.canStrong = true;
            // Early exit
            return;
        }

        // Test if the selection contains a strong
        if ( !this._selectionContainsTokenOfType( selection, "Strong" ) ) {
            state.canStrong = true;
        }
    }

    /**
     * Pitch for italic
     */
    _pitchEmph( state, selection ) {
        state.isEm = ToggleParser._isOfTypeOrAncestors( selection, "Emph",
                                                        true );
        // If self or ancestor is emph, can unemph toggle, so permit true.
        if ( state.isEm ) {
            state.canEm = true;
            // Early exit
            return;
        }

        // Shortcircuit on invalid blocks
        if ( selection.type === "Image" || selection.type === "Link" ) {
            state.canEm = false;
            return;
        }

        // Detect multiblock selection
        if ( !ToggleParser._isHighestLevelBlock( selection ) ) {
            state.canEm = false;
            return;
        }

        // An empty selection has no use here
        if ( this._selectionIsEmpty() ) {
            state.canEm = true;
            // Early exit
            return;
        }

        // Test if the selection contains an emph
        if ( !this._selectionContainsTokenOfType( selection, "Emph" ) ) {
            state.canEm = true;
        }
    }

    /**
     * Pitch quote
     */
    _pitchQuote( state, selection ) {

        // Try to bubble to the quote
        state.isQuote = ToggleParser._isOfTypeOrAncestors(
            selection, "BlockQuote", false );

        // If of type quote, one can unquote
        if ( state.isQuote ) {
            state.canQuote = true;
            return;
        }

        // Detect where a quote can be inserted
        if ( ToggleParser._isOfTypeOrAncestors(
                selection, "Paragraph", false ) ) {

            if ( !ToggleParser._isOfTypeOrAncestors(
                    selection, "List", false ) ) {
                state.canQuote = true;
                return;
            }
        }

    }

    /**
     * Fetch a selection state object
     */
    get _selectionState() {

        if ( this._selectionStateBuffer === null ) {

            let state = Object.assign( {}, defaultSelectionState );

            let selection = this._selectionContainer;

            // Pitch posibilities
            this._pitchStrong( state, selection );
            this._pitchEmph( state, selection );
            this._pitchQuote( state, selection );

            this._selectionStateBuffer = state;
        }

        return this._selectionStateBuffer;
    }

    /**
     * Test for empty selection
     */
    _selectionIsEmpty() {
        let selection = this._currentSelection;

        return ToggleParser._cursorCompare(
            selection.start, selection.end ) === 0;
    }

    /**
     * Test if the current selection contains a token of a certain type
     */
    _selectionContainsTokenOfType( node, type ) {
        let selection = this._currentSelection;

        let child = node.firstChild;

        while( child !== null ) {

            // First do boundaries check
            let container = ToggleParser._getSourcePos( child );
            let endsBeforeSelection = ToggleParser._cursorCompare(
                container.end, selection.start ) === -1;
            let startsAfterSelection = ToggleParser._cursorCompare(
                container.start, selection.end  ) === 1;

            if ( startsAfterSelection ) {
                // Conclude nothing found
                return false;
            }

            // Skip if too early
            if ( !endsBeforeSelection ) {
                // Continue tests, falls within selection
                if ( child.type === type ) {
                    return true;
                } else if ( child.isContainer ) {
                    if ( this._selectionContainsTokenOfType( child, type ) ) {
                        return true;
                    }
                }

            }

            // Do next child
            child = child.next;
        }

        // Nothing found
        return false;
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

            while( child !== null ) {
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

    /**
     * Test if a node is an inline
     */
    static _isInline( node ) {
        return INLINES.has( node.type );
    }

    /**
     * Test if a node is of a type or has ancestors of a type
     *
     * Optional only inlines
     */
    static _isOfTypeOrAncestors( node, type, onlyInlines ) {
        if ( typeof onlyInlines === "undefined" ) {
            onlyInlines = false;
        } else {
            onlyInlines = !!onlyInlines;
        }

        let nodeToTest = node;

        if ( !ToggleParser._isInline( node ) && onlyInlines ) {
            return false;
        }

        while( nodeToTest !== null ) {
            if ( nodeToTest.type === type ) {
                return true;
            }

            nodeToTest = nodeToTest.parent;

            if ( onlyInlines && nodeToTest !== null &&
                 !ToggleParser._isInline( nodeToTest ) ) {
                nodeToTest = null;
            }
        }

        // Nothing found
        return false;

    }

    /**
     * Test if is highest level block
     */
    static _isHighestLevelBlock( node ) {
        // Test if children are blocktype nodes
        let child = node.firstChild;

        while( child !== null ) {
            if ( !INLINES.has( child.type ) ) {
                return false;
            }

            child = child.next;
        }

        return true;
    }

    /**
     * Fetch the first occurence of a type node
     */
    static _getHighestLevelNodeOfType( node, type ) {

        while( node !== null ) {
            if ( node.type === type ) {
                return node;
            }

            node = node.parent;
        }

        return false;
    }

}
