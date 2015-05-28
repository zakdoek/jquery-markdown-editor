/**
 * Editor main file
 */

(function() {

    "use strict";

    ( function( window, factory ) {

        // universal module definition

         /*global define: false, module: false, require: false */

     if ( typeof define === "function" && define.amd ) {
         // AMD
         define( [
             "marked/lib/marked",
             "./gears",
             "CodeMirror/lib/codemirror",
             "CodeMirror/addon/edit/continuelist",
             "./tab-continuelist",
             "CodeMirror/mode/xml/xml",
             "CodeMirror/mode/markdown/markdown"
         ], function( marked, MarkdownEditorGears, CodeMirror ) {
             return factory( marked, MarkdownEditorGears, CodeMirror );
         });
     } else if ( typeof exports === "object" ) {
         // CommonJS
         module.exports = factory(
             require( "marked/lib/marked" ),
             require( "./gears" ),
             require( "CodeMirror/lib/codemirror" ),
             require( "CodeMirror/addon/edit/continuelist" ),
             require( "./tab-continuelist" ),
             require( "CodeMirror/mode/xml/xml" ),
             require( "CodeMirror/mode/markdown/markdown" )
         );
     } else {
         // browser global
         window.MarkdownEditor = factory( window.marked,
                                          window.MarkdownEditorGears,
                                          window.CodeMirror );
     }

    })( window, function( marked, Gears, CodeMirror ) {

        // Define default toolbar
        // var toolbar = [
        //     { name: "bold", action: Gears.toggleBold },
        //     { name: "italic", action: Gears.toggleItalic },
        //     { name: "code", action: Gears.toggleCodeBlock },
        //     "|",

        //     { name: "quote", action: Gears.toggleBlockquote },
        //     { name: "unordered-list", action: Gears.toggleUnOrderedList },
        //     { name: "ordered-list", action: Gears.toggleOrderedList },
        //     "|",

        //     { name: "link", action: Gears.drawLink },
        //     { name: "image", action: Gears.drawImage },
        //     "|",

        //     { name: "info", action: "http://lab.lepture.com/editor/" },
        //     { name: "preview", action: Gears.togglePreview },
        //     { name: "fullscreen", action: Gears.toggleFullScreen }
        // ];
        var toolbar = [];

        /**
         * Interface of Editor.
         */
        function Editor( options ) {
            options = options || {};

            if ( options.element ) {
                this.element = options.element;
            }

            options.toolbar = options.toolbar || Editor.toolbar;
            // you can customize toolbar with object
            // [{name: 'bold', shortcut: 'Ctrl-B', className: 'icon-bold'}]

            if ( !options.hasOwnProperty( "status" ) ) {
                options.status = [ "lines", "words", "cursor" ];
            }

            this.options = options;

            // If user has passed an element, it should auto rendered
            if ( this.element ) {
                this.render();
            }
        }

        /**
         * Default toolbar elements.
         */
        Editor.toolbar = toolbar;

        /**
         * Default markdown render.
         */
        Editor.markdown = function( text ) {
            if ( window.marked ) {
                // use marked as markdown parser
                // Add marked options
                return marked(text);
            }
        };

        /**
         * Render editor to the given element.
         */
        Editor.prototype.render = function( el ) {
            if ( !el ) {
                el = this.element ||
                     document.getElementsByTagName( "textarea" )[ 0 ];
            }

            if ( this._rendered && this._rendered === el ) {
                // Already rendered.
                return;
            }

            this.element = el;
            var options = this.options;

            var self = this;
            var keyMaps = {};

            function createKeyMapping( callback ) {
                return function() {
                    callback( self );
                };
            }

            for ( var key in Gears.shortcuts ) {
                keyMaps[ Gears.fixShortcut( key ) ] = createKeyMapping(
                    Gears.shortcuts[ key ] );
            }

            keyMaps.Enter = "newlineAndIndentContinueMarkdownList";
            keyMaps.Tab = "tabAndIndentContinueMarkdownList";
            keyMaps[ "Shift-Tab" ] = "shiftTabAndIndentContinueMarkdownList";

            this.codemirror = CodeMirror.fromTextArea( el, {
                mode: "markdown",
                theme: "base16-light",
                tabSize: "2",
                indentWithTabs: true,
                lineNumbers: false,
                lineWrapping: true,
                autofocus: true,
                extraKeys: keyMaps
            });

            if ( options.toolbar !== false ) {
                this.createToolbar();
            }
            if ( options.status !== false ) {
                this.createStatusbar();
            }

            this._rendered = this.element;
        };

        /**
         * Create the toolbar
         */
        Editor.prototype.createToolbar = function( items ) {
            items = items || this.options.toolbar;

            if ( !items || items.length === 0 ) {
                return;
            }

            var bar = document.createElement( "div" );
            bar.className = "editor-toolbar";

            var self = this;

            self.toolbar = {};

            function createAction( action ) {
                return function() {
                    action( self );
                };
            }

            for ( var i = 0; i < items.length; i++ ) {
                var icon,
                    item = items[ i ];
                if ( item.name ) {
                    icon = Gears.createIcon( item.name, item );
                } else if ( item === "|" ) {
                    icon = Gears.createSep();
                } else {
                    icon = Gears.createIcon( item );
                }

                // bind events, special for info
                if ( item.action ) {
                    if ( typeof item.action === "function" ) {
                        icon.onclick = createAction( item.action );
                    } else if ( typeof item.action === "string" ) {
                        icon.href = item.action;
                        icon.target = "_blank";
                    }
                }

                self.toolbar[ item.name || item ] = icon;
                bar.appendChild( icon );
            }

            var cm = this.codemirror;
            cm.on( "cursorActivity", function() {

                var stat = Gears.getState( cm );

                for ( var key in self.toolbar ) {
                    var el = self.toolbar[ key ];
                    if ( stat[ key ]  ) {
                        el.className += " active";
                    } else {
                        el.className = el.className.replace( /\s*active\s*/g,
                                                             "" );
                    }
                }
            });

            var cmWrapper = cm.getWrapperElement();
            cmWrapper.parentNode.insertBefore( bar, cmWrapper );
            return bar;
        };

        /**
         * Create the status bar
         */
        Editor.prototype.createStatusbar = function( status ) {
            status = status || this.options.status;

            // Short circuit
            if ( !status || status.length === 0 ) {
                return;
            }

            var bar = document.createElement( "div" );
            bar.className = "editor-statusbar";

            var pos, cm = this.codemirror;

            function createUpdateWordCount( el ) {
                return function() {
                    el.innerHTML = Gears.wordCount( cm.getValue() );
                };
            }

            function createUpdateLineCount( el ) {
                return function() {
                    el.innerHTML = cm.lineCount();
                };
            }

            function createUpdateCursorPos( el ) {
                return function() {
                    pos = cm.getCursor();
                    el.innerHTML = pos.line + ":" + pos.ch;
                };
            }

            for ( var i = 0; i < status.length; i++ ) {
                var el = document.createElement( "span" ),
                    name = status[ i ];
                el.className = name;
                if ( name === "words" ) {
                    el.innerHTML = "0";
                    cm.on( "update", createUpdateWordCount( el ) );
                } else if ( name === "lines" ) {
                    el.innerHTML = "0";
                    cm.on( "update", createUpdateLineCount( el ) );
                } else if ( name === "cursor" ) {
                    el.innerHTML = "0:0";
                    cm.on( "cursorActivity", createUpdateCursorPos( el ) );
                }
                bar.appendChild( el );
            }
            var cmWrapper = this.codemirror.getWrapperElement();
            cmWrapper.parentNode.insertBefore( bar, cmWrapper.nextSibling );
            return bar;
        };

        /**
         * Get or set the text content.
         */
        Editor.prototype.value = function( val ) {
            if ( val ) {
                this.codemirror.getDoc().setValue( val );
                return this;
            } else {
                return this.codemirror.getValue();
            }
        };


        /**
         * Bind static methods for exports.
         */
        Editor.toggleBold = Gears.toggleBold;
        Editor.toggleItalic = Gears.toggleItalic;
        Editor.toggleBlockquote = Gears.toggleBlockquote;
        Editor.toggleUnOrderedList = Gears.toggleUnOrderedList;
        Editor.toggleOrderedList = Gears.toggleOrderedList;
        Editor.drawLink = Gears.drawLink;
        Editor.drawImage = Gears.drawImage;
        Editor.undo = Gears.undo;
        Editor.redo = Gears.redo;
        Editor.togglePreview = Gears.togglePreview;
        Editor.toggleFullScreen = Gears.toggleFullScreen;

        /**
         * Bind instance methods for exports.
         */
        Editor.prototype.toggleBold = function() {
            Gears.toggleBold( this );
        };
        Editor.prototype.toggleItalic = function() {
            Gears.toggleItalic( this );
        };
        Editor.prototype.toggleBlockquote = function() {
            Gears.toggleBlockquote( this );
        };
        Editor.prototype.toggleUnOrderedList = function() {
            Gears.toggleUnOrderedList( this );
        };
        Editor.prototype.toggleOrderedList = function() {
            Gears.toggleOrderedList( this );
        };
        Editor.prototype.drawLink = function() {
            Gears.drawLink( this );
        };
        Editor.prototype.drawImage = function() {
            Gears.drawImage( this );
        };
        Editor.prototype.undo = function() {
            Gears.undo( this );
        };
        Editor.prototype.redo = function() {
            Gears.redo( this );
        };
        Editor.prototype.togglePreview = function() {
            Gears.togglePreview( this );
        };
        Editor.prototype.toggleFullScreen = function() {
            Gears.toggleFullScreen( this );
        };

        return Editor;

    });

})();
