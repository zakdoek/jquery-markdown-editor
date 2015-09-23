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
    static isOfTypeOrAncestors( node, type, onlyInlines ) {
        if ( typeof onlyInlines === "undefined" ) {
            onlyInlines = false;
        } else {
            onlyInlines = !!onlyInlines;
        }

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
}
