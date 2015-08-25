/**
 * Editor inner workings library
 */

(function() {

    "use strict";

    ( function( window, factory ) {

        // universal module definition

         /*global define: false, module: false */

     if ( typeof define === "function" && define.amd ) {
         // AMD
         define( [], function() {
             return factory();
         });
     } else if ( typeof exports === "object" ) {
         // CommonJS
         module.exports = factory();
     } else {
         // browser global
        window.jqueryMarkdownEditor = window.jqueryMarkdownEditor || {};
        window.jqueryMarkdownEditor.gears = factory();
     }

    })( window, function() {

        /**
         * Privates
         */

        var isMac = /Mac/.test(navigator.platform);

        /**
         * Publics
         */

        var shortcuts;

        /**
         * Fix shortcut. Mac use Command, others use Ctrl.
         */
        function fixShortcut( name ) {
            if ( isMac ) {
                name = name.replace( "Ctrl" , "Cmd" );
            } else {
                name = name.replace( "Cmd", "Ctrl" );
            }
            return name;
        }

        /**
         * Create icon element for toolbar.
         */
        function createIcon( name, options ) {
            options = options || {};
            var el = document.createElement( "a" );

            var shortcut = options.shortcut || shortcuts[ name ];
            if ( shortcut ) {
                shortcut = fixShortcut( shortcut );
                el.title = shortcut;
                el.title = el.title.replace( "Cmd", "⌘" );
                if ( isMac ) {
                    el.title = el.title.replace( "Alt", "⌥" );
                }
            }

            el.className = options.className || "jquery-markdown-editor-" +
                                                name;
            return el;
        }

        /**
         * Create separator element for toolbar.
         */
        function createSep() {
            var el = document.createElement( "i" );
            el.className = "separator";
            el.innerHTML = "|";
            return el;
        }

        /**
         * Toggle full screen of the editor.
         */
        function toggleFullScreen( editor ) {
            var el = editor.codemirror.getWrapperElement();

            // https://developer.mozilla.org/en-US/docs/DOM/
            // Using_fullscreen_mode
            var doc = document;
            var isFull = doc.fullScreen || doc.mozFullScreen ||
                         doc.webkitFullScreen;
            var request = function() {
                if ( el.requestFullScreen ) {
                    el.requestFullScreen();
                } else if ( el.mozRequestFullScreen ) {
                    el.mozRequestFullScreen();
                } else if ( el.webkitRequestFullScreen ) {
                    el.webkitRequestFullScreen( Element.ALLOW_KEYBOARD_INPUT );
                }
            };
            var cancel = function() {
                if ( doc.cancelFullScreen ) {
                    doc.cancelFullScreen();
                } else if ( doc.mozCancelFullScreen ) {
                    doc.mozCancelFullScreen();
                } else if ( doc.webkitCancelFullScreen ) {
                    doc.webkitCancelFullScreen();
                }
            };
            if ( !isFull ) {
                request();
            } else if ( cancel ) {
                cancel();
            }
        }

        /**
         * Action for toggling bold.
         */
        function toggleBold( editor ) {
            /* global console */
            console.log( "Bold/Unbold", editor );
        }

        /**
         * Action for toggling italic.
         */
        function toggleItalic( editor ) {
            /* global console */
            console.log( "Italic/UnItalic", editor );
        }

        /**
         * Action for toggling code block.
         */
        function toggleCodeBlock( editor ) {
            /* global console */
            console.log( "Code / UnCode", editor );
        }

        /**
         * Action for toggling blockquote.
         */
        function toggleBlockquote( editor ) {
            /* global console */
            console.log( "Code / UnCode", editor );
        }

        /**
         * Action for toggling ul.
         */
        function toggleUnOrderedList( editor ) {
            /* global console */
            console.log( "code / uncode", editor );
        }

        /**
         * Action for toggling ol.
         */
        function toggleOrderedList( editor ) {
            /* global console */
            console.log( "code / uncode", editor );
        }

        /**
         * Action for drawing a link.
         */
        function drawLink( editor ) {
            /* global console */
            console.log( "code / uncode", editor );
        }

        /**
         * Action for drawing an img.
         */
        function drawImage( editor ) {
            /* global console */
            console.log( "code / uncode", editor );
        }

        /**
         * Undo action.
         */
        function undo( editor ) {
            var cm = editor.codemirror;
            cm.undo();
            cm.focus();
        }

        /**
         * Redo action.
         */
        function redo( editor ) {
            var cm = editor.codemirror;
            cm.redo();
            cm.focus();
        }

        /**
         * Preview action.
         *
         * !REVIEW!
         */
        function togglePreview( editor ) {
            var toolbar = editor.toolbar.preview;
            var parse = editor.constructor.markdown;
            var cm = editor.codemirror;
            var wrapper = cm.getWrapperElement();
            var preview = wrapper.lastChild;
            if ( !/editor-preview/.test( preview.className ) ) {
                preview = document.createElement( "div" );
                preview.className = "editor-preview";
                wrapper.appendChild( preview );
            }
            if ( /editor-preview-active/.test( preview.className ) ) {
                preview.className = preview.className.replace(
                    /\s*editor-preview-active\s*/g, ""
                );
                toolbar.className = toolbar.className.replace(
                    /\s*active\s*/g, "");
            } else {
                /* When the preview button is clicked for the first time,
                 * give some time for the transition from editor.css to fire
                 * and the view to slide from right to left, instead of just
                 * appearing.
                 */
                setTimeout(function() {
                    preview.className += " editor-preview-active";
                }, 1 );
                toolbar.className += " active";
            }
            var text = cm.getValue();
            preview.innerHTML = parse( text );
        }

        /**
         * The right word count in respect for CJK.
         */
        function wordCount( codemirror ) {
            var pattern = new RegExp( "[a-zA-Z0-9_\\u0392-\\u03c9]+|" +
                                      "[\\u4E00-\\u9FFF\\u3400-\\u4dbf" +
                                      "\\uf900-\\ufaff\\u3040-\\u309f" +
                                      "\\uac00-\\ud7af]+", "g" ),
                data = codemirror.getValue(),
                match = data.match( pattern ),
                count = 0;

            if( match === null ) {
                return count;
            }
            for ( var i = 0; i < match.length; i++ ) {
                if ( match[ i ].charCodeAt( 0 ) >= 0x4E00 ) {
                    count += match[ i ].length;
                } else {
                    count += 1;
                }
            }
            return count;
        }

        /**
         * Get the state
         */
        function getState( cm ) {
            /* global console */
            console.log( "Get State", cm );

            return {};
        }

        // Shortcuts
        shortcuts  = {
            "Cmd-B": toggleBold,
            "Cmd-I": toggleItalic,
            "Cmd-K": drawLink,
            "Cmd-Alt-I": drawImage,
            "Cmd-'": toggleBlockquote,
            "Cmd-Alt-L": toggleOrderedList,
            "Cmd-L": toggleUnOrderedList
        };

        // Export
        var Gears = {
            shortcuts: shortcuts,
            fixShortcut: fixShortcut,
            createIcon: createIcon,
            createSep: createSep,
            toggleFullScreen: toggleFullScreen,
            toggleBold: toggleBold,
            toggleItalic: toggleItalic,
            toggleCodeBlock: toggleCodeBlock,
            toggleBlockquote: toggleBlockquote,
            toggleUnOrderedList: toggleUnOrderedList,
            toggleOrderedList: toggleOrderedList,
            drawLink: drawLink,
            drawImage: drawImage,
            undo: undo,
            redo: redo,
            togglePreview: togglePreview,
            wordCount: wordCount,
            getState: getState
        };

        return Gears;

    });

})();
