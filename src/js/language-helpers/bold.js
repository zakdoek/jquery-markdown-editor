/**
 * Bold helpers
 */

(function() {

    "use strict";

    ( function( window, factory ) {

        // universal module definition

        /*global define: false, module: false */

        if ( typeof define === "function" && define.amd ) {
            // AMD
            define( [
                "../utils/types"
            ], function( types ) {
                return factory( types );
            });
        } else if ( typeof exports === "object" ) {
            // CommonJS
            module.exports = factory(
                require( "../utils/types" )
            );
        } else {
            // browser global
            window.jqueryMarkdownEditor = window.jqueryMarkdownEditor || {};
            window.jqueryMarkdownEditor.languageHelpers =
                window.jqueryMarkdownEditor.languageHelpers || {};
            window.jqueryMarkdownEditor.languageHelpers.bold =
                window.jqueryMarkdownEditor.languageHelpers.bold || {};
            window.jqueryMarkdownEditor.languageHelpers.bold = factory(
                window.jqueryMarkdownEditor.utils.types
            );
        }

    })( window, function( types ) {

        /**
         * Position comparator
         *
         * Returns true if position1 is greater than position2
         */
        // function isGreaterThan( position1, position2, equal ) {
        //     if ( position1.line > position2.line ) {
        //         return true;
        //     } else if ( position1.line === position2.line ) {
        //         if ( position1.ch > position2.ch ||
        //              ( equal === true && position1.ch === position2.ch ) ) {
        //             return true;
        //         }
        //     }
        //     return false;
        // }

        /**
         * Smaller equivalent
         */
        // function isSmallerThan( position1, position2, equal ) {
        //     return isGreaterThan( position2, position1, !equal );
        // }

        /**
         * Find position in array and get
         *
         * Should return the closest smaller position or false
         *
         * Find the closest larger position or false if larger is true
         *
         * Does consider equal as inclusive if true
         *
         * returns false if none can be found
         */
        // function getClosestPosition( array, pos, larger, equal ) {
        //     var i;
        //     var selectedPosition = false;

        //     for ( i = 0; i < array.length; i++ ) {
        //         var item = array[ i ];

        //         if ( larger ) {
        //             if ( isGreaterThan( pos, item, equal ) ) {
        //                 selectedPosition = item;
        //                 break;
        //             }
        //         } else {
        //             if ( isSmallerThan( pos, item, equal ) ) {
        //                 selectedPosition = item;
        //             } else {
        //                 break;
        //             }
        //         }
        //     }

        //     return selectedPosition;
        // }

        /**
         * Get current block
         *
         * Add lines until empty line or undefined reached.
         *
         * If selection spans more lines, or cannot considered a block, return
         * false.
         */
        function getSelectedBlock( editor ) {
            // Shortcut for codemirror
            var cm = editor.codemirror;

            // Get the start position
            var startPosition = cm.getCursor( "from" );
            var endPosition = cm.getCursor( "to" );
            var lineBuffer = cm.getLine( startPosition.line );
            var startLineNumber = startPosition.line;
            var endLineNumber = startPosition.line;
            var currentLineNumber;
            var blockTokens = [];

            if ( !lineBuffer.length ) {
                return {
                    empty: true,
                    multiple: false,
                    tokens: null
                };
            }

            // Seek block start
            while ( startLineNumber > 0 ) {
                lineBuffer = cm.getLine( startLineNumber - 1 );

                if ( !lineBuffer.length ) {
                    break;
                }

                startLineNumber--;
            }

            // Seek block end
            while( true ) {
                lineBuffer = cm.getLine( endLineNumber + 1 );

                if ( types.isUndefined( lineBuffer ) || !lineBuffer.length ) {
                    // End of block detected
                    break;
                }

                endLineNumber++;
            }

            if ( endLineNumber < endPosition.line ) {
                return {
                    empty: false,
                    multiple: true,
                    tokens: null
                };
            }

            // Fetch contents
            currentLineNumber = startLineNumber;
            while ( currentLineNumber <= endLineNumber ) {
                blockTokens.push({
                    content: cm.getLine( currentLineNumber ),
                    line: currentLineNumber
                });
                currentLineNumber++;
            }

            return {
                empty: false,
                multiple: false,
                tokens: blockTokens
            };
        }

        /**
         * Bold lexer
         */
        function getBoldTokens( editor ) {
            var blockTokens = getSelectedBlock( editor );

            if ( blockTokens.empty || blockTokens.multiple ) {
                return false;
            }

            var boldTokens = [];
            var boldRegex = /^.*?(\*\*|__)/g;
            var parseState = {
                "**": false,
                "__": false
            };

            var lineBuffer, i;

            for( i = 0; i < blockTokens.tokens.length; i++ ) {

                lineBuffer = blockTokens.tokens[ i ].content;

                var eaten = 0;
                var result = lineBuffer.match( boldRegex );

                while( result ) {
                    var unpacked = result[ 0 ];
                    var symbol = unpacked.substring( unpacked.length - 2 );
                    parseState[ symbol ] = !parseState[ symbol ];
                    eaten += unpacked.length;
                    lineBuffer = lineBuffer.substring( unpacked.length );
                    boldTokens.push({
                        line: blockTokens.tokens[ i ].line,
                        ch: eaten - 2,
                        symbol: symbol,
                        isOpen: parseState[ symbol ]
                    });
                    result = lineBuffer.match( boldRegex );
                }
            }

            return boldTokens;
        }

        /**
         * Expand the selection or false if invalid
         */
        function selectionAnalyis( editor ) {

            // get tokens
            var boldTokens = getBoldTokens( editor );

            // Check soiled
            // No block could be singled out for parsing
            if ( boldTokens === false ) {
                // Return soiled, empty block or multi block
                return {
                    isMatch: false,
                    isClean: false,
                    isOverlapping: false,
                    isSoiled: true
                };
            }

            // Check no markings at all
            // No inlines are defined inside the block
            if ( !boldTokens.length ) {
                return {
                    isMatch: false,
                    isClean: true,
                    isOverlapping: false,
                    isSoiled: false
                };
            }

            // Check match
            // StartPosition should be should be greater than token n of the
            // same type and endposition should be smaller than token n+1 of
            // the same type

            // Check overlapping
            // Start should be smaller than n of type and end should be
            // greater than n+1 of type

            // Check clean
            // the immediate smaller of start should not be isOpen and the
            // x+1 where x is the immediate smaller should be larger than end

            // All from now should be marked soiled

            // get cursor
            var startPosition = editor.codemirror.getCursor( "from" );
            var endPosition = editor.codemirror.getCursor( "to" );

            var i;
            var startToken = false;
            var endTokenIdx = false;
            var endToken = false;

            // Scan if over
            for ( i = 0; i < boldTokens.length; i++ ) {
                var token = boldTokens[ i ];

                if ( startPosition.line > token.line ) {
                    startToken = token;
                    endTokenIdx = i + 1;
                } else if ( startPosition.line === token.line &&
                            startPosition.ch > token.ch + 1 ) {
                    startToken = token;
                    endTokenIdx = i + 1;
                } else {
                    break;
                }
            }

            // Test for a positive
            if ( startToken.isOpen && endTokenIdx < boldTokens.length ) {
                endToken = boldTokens[ endTokenIdx ];
                if ( endPosition.line < endToken.line ||
                     ( endPosition.line === endToken.line &&
                       endPosition.ch <= endToken.ch ) ) {
                    /* global console */
                    console.log( "VALID" );
                    return {
                        isMatch: true,
                        isClean: false,
                        isOverlapping: false,
                        isSoiled: false,
                        start: startToken,
                        end: endToken
                    };
                }
            }

            /* global console */
            console.log( "CLEAN OR SOILED",
                         "TOKENS", startToken, endToken,
                         "POSITIONS", startPosition, endPosition );
            // Return clean
            return false;
        }

        /**
         * Test if the selection is contained within a bold inline element. If
         * so, return true, else return false.
         */
        function test( editor ) {
            // TODO: Make more informative
            // CanBold
            // CanLink
            // CanItalic
            // CanImage
            // TODO: Returns object with 3 arrays (active, normal, disabled)
            return selectionAnalyis( editor ).isMatch;
        }

        /**
         * Toggle the state of the current selection. If test is true, unbold
         * the thing. Else, toggle the thing.
         */
        function toggle( editor ) {
            /* global console */
            console.log( editor );
        }

        return {
            test: test,
            toggle: toggle
        };

    });

})();
