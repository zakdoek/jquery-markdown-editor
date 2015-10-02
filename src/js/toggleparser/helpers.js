/**
 * Toggleparser static helper lib
 */

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

export default class Helpers {

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
                Helpers._innerPopulateSourcePos( child, currentLine,
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
            // Make sure blockQuote offset is taken into account
            let block = Helpers.getHighestLevelBlock( node );
            currentChar = Helpers.getSourcePos( block ).start.ch + 1;
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
     * Compares cursors
     *
     * Return 0 if a equals b
     * Return -1 if a is less than b
     * Return 1 if a is greater than b
     */
    static cursorCompare( a, b ) {
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
    static getSourcePos( node ) {
        let sourcepos = node.sourcepos;

        if ( typeof node.sourcepos === "undefined" ) {
            // Fill with source pos.
            if ( typeof node._extraSourcepos === "undefined" ) {
                Helpers._innerPopulateSourcePos(
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
     * Test if a node is of a type or has ancestors of a type
     *
     * Optional only inlines
     */
    static isOfTypeOrAncestors( node, type, onlyInlines = false ) {
        onlyInlines = !!onlyInlines;

        let nodeToTest = node;

        if ( !Helpers._isInline( node ) && onlyInlines ) {
            return false;
        }

        while( nodeToTest !== null ) {
            if ( nodeToTest.type === type ) {
                return true;
            }

            nodeToTest = nodeToTest.parent;

            if ( onlyInlines && nodeToTest !== null &&
                 !Helpers._isInline( nodeToTest ) ) {
                nodeToTest = null;
            }
        }

        // Nothing found
        return false;

    }

    /**
     * Test if is highest level block
     */
    static isHighestLevelBlock( node ) {
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
     * Get the hightest level that is a block type
     */
    static getHighestLevelBlock( node ) {

        while( node !== null ) {
            if ( !INLINES.has( node.type ) ) {
                return node;
            }

            node = node.parent;
        }

        return false;
    }

    /**
     * Fetch the first occurence of a type node
     */
    static getHighestLevelNodeOfType( node, type ) {

        while( node !== null ) {
            if ( node.type === type ) {
                return node;
            }

            node = node.parent;
        }

        return false;
    }

    /**
     * Test if the current selection contains a token of a certain type
     */
    static selectionContainsTokenOfType( selection, node, type ) {
        let child = node.firstChild;

        while( child !== null ) {

            // First do boundaries check
            let container = Helpers.getSourcePos( child );
            let endsBeforeSelection = Helpers.cursorCompare(
                container.end, selection.start ) === -1;
            let startsAfterSelection = Helpers.cursorCompare(
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
                    if ( Helpers.selectionContainsTokenOfType(
                            selection, child, type ) ) {
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
    static tryLevelZoom( node, selection ) {

        // Populate initial child
        let child = node.firstChild;

        while( child !== null ) {

            // Only scan containers
            if ( child.isContainer ) {
                // Perform tests
                // Start of selection should be greater than child span
                // End of selection should be lesser than child span

                // Convenience variables
                let childSourceRange = Helpers.getSourcePos( child );
                let compChildSelectionStart = Helpers.cursorCompare(
                    childSourceRange.start, selection.start );
                let compChildSelectionEnd = Helpers.cursorCompare(
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
     * Get the containing node of a current selection
     */
    static getSelectionContainer( selection, tree ) {

        let node = tree;
        let attempt = Helpers.tryLevelZoom( node, selection );

        while( attempt ) {

            // Attempt is true, so set to node
            node = attempt;

            // New attempt
            attempt = Helpers.tryLevelZoom( node, selection );

        }

        return node;
    }

    /**
     * Test for empty selection
     */
    static selectionIsEmpty( selection ) {
        return Helpers.cursorCompare(
            selection.start, selection.end ) === 0;
    }

    /**
     * Test if inner selection contains a part of the destination
     *
     * Assumes a zoomed node
     */
    static selectionIsLimitedToContent( selection, node ) {

        if ( !node.isContainer ) {
            return true;
        }

        let start = Helpers.getSourcePos( node.firstChild ).start;
        let end = Helpers.getSourcePos( node.lastChild ).end;

        if ( Helpers.cursorCompare( start, selection.start ) <= 0 &&
             Helpers.cursorCompare( end, selection.end ) >= 0 ) {
            return true;
        }
        return false;
    }

    /**
     * Test if a child container is only partially selected
     */
    static childContainerIsPartiallySelected( selection, node ) {

        // Short circuit
        if ( !node.isContainer || node.firstChild === node.lastChild ) {
            return false;
        }

        // Get the node containing the start of selection
        // Get the node containing the end of selection
        // Use nodes to detect partial selection

        let startSelectionContainer = Helpers.getSelectionContainer({
            start: selection.start,
            end: selection.start
        }, node );

        let endSelectionContainer = Helpers.getSelectionContainer({
            start: selection.end,
            end: selection.end
        }, node );

        if ( startSelectionContainer !== endSelectionContainer ) {
            return true;
        }

        return false;
    }
}
