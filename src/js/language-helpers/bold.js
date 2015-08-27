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
                return false;
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
                    break;
                }

                endLineNumber++;
            }

            if ( endLineNumber < endPosition.line ) {
                return false;
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

            return blockTokens;
        }

        /**
         * Bold lexer
         */
        function getBoldTokens( editor ) {
            var blockTokens = getSelectedBlock( editor );

            if ( !blockTokens || !blockTokens.length ) {
                return;
            }

            var boldTokens = [];
            var boldRegex = /^.*?(\*\*|__)/g;
            var parseState = {
                "**": false,
                "__": false
            };

            var lineBuffer, i;

            for( i = 0; i < blockTokens.length; i++ ) {

                lineBuffer = blockTokens[ i ].content;

                var eaten = 0;
                var result = lineBuffer.match( boldRegex );

                while( result ) {
                    var unpacked = result[ 0 ];
                    var symbol = unpacked.substring( unpacked.length - 2 );
                    parseState[ symbol ] = !parseState[ symbol ];
                    eaten += unpacked.length;
                    lineBuffer = lineBuffer.substring( unpacked.length );
                    boldTokens.push({
                        line: blockTokens[ i ].line,
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
         * Test if the selection is contained within a bold inline element. If
         * so, return true, else return false.
         */
        function test( editor ) {

            // get tokens
            var boldTokens = getBoldTokens( editor );

            if ( !boldTokens ) {
                return false;
            }

            // get cursor
            var startPosition = editor.codemirror.getCursor( "from" );
            var endPosition = editor.codemirror.getCursor( "to" );

            var i;
            var startToken = false;
            var endTokenIdx = false;

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

            if ( startToken.isOpen && endTokenIdx < boldTokens.length ) {
                var endToken = boldTokens[ endTokenIdx ];
                if ( endPosition.line < endToken.line ||
                     ( endPosition.line === endToken.line &&
                       endPosition.ch <= endToken.ch ) ) {
                    return true;
                }
            }

            // Catch all for now
            return false;
        }

        /**
         * Toggle the state of the current selection. If test is true, unbold
         * the thing. Else, toggle the thing.
         */
        function toggle() {
            // Dummy
        }

        return {
            test: test,
            toggle: toggle
        };

    });

})();
