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
             "jquery",
             "./gears",
             "./utils/types",
             "./toolbar/class",
             "./statusbar/class",
             "CodeMirror/lib/codemirror",
             "CodeMirror/addon/edit/continuelist",
             "./tab-continuelist",
             "CodeMirror/mode/xml/xml",
             "CodeMirror/mode/markdown/markdown"
         ], function( $, gears, types, Toolbar, StatusBar, CodeMirror ) {
             return factory( $, gears, types, Toolbar, StatusBar, CodeMirror );
         });
     } else if ( typeof exports === "object" ) {
         // CommonJS
         module.exports = factory(
             require( "jquery" ),
             require( "./gears" ),
             require( "./utils/types" ),
             require( "./toolbar/class" ),
             require( "./statusbar/class" ),
             require( "CodeMirror/lib/codemirror" ),
             require( "CodeMirror/addon/edit/continuelist" ),
             require( "./tab-continuelist" ),
             require( "CodeMirror/mode/xml/xml" ),
             require( "CodeMirror/mode/markdown/markdown" )
         );
     } else {
         // browser global
         window.MarkdownEditor = factory( window.jQuery,
                                          window.gears,
                                          window.utils.types,
                                          window.toolbar.Toolbar,
                                          window.statusBar.StatusBar,
                                          window.CodeMirror );
     }

    })( window, function( $, gears, types, Toolbar, StatusBar, CodeMirror ) {

        /**
         * Interface of Editor.
         */
        function Editor( options ) {
            // TODO: Mix with default options
            this._options = options || {};

            // Short circuit. A text area element is the minimum requirement
            // TODO: Add test if element is text area
            if ( types.isUndefined( this._options.element ) ) {
                return;
            }

            // Store the element for reference
            this._element = this._options.element;

            // Initialize the editor
            this._init();
        }

        /**
         * Initialize the editor
         */
        Editor.prototype._init = function() {

            var self = this,
                keyMaps = {};

            // TODO: Add extra keymaps

            keyMaps.Enter = "newlineAndIndentContinueMarkdownList";
            keyMaps.Tab = "tabAndIndentContinueMarkdownList";
            keyMaps[ "Shift-Tab" ] = "shiftTabAndIndentContinueMarkdownList";

            // Wrap the element
            this._$wrapper = $( this._element ).wrap( "<div></div>" ).parent();
            this._$wrapper.addClass( "jquery-markdown-editor" );

            // Append toolbar
            if ( this._options.toolbar !== false ) {
                // Add the toolbar
                this._toolbar = new Toolbar( this._$wrapper,
                                             this._options.toolbar );

                // Dummy active marking
                this._toolbar.markActive( "bold" );
                this._toolbar.markActive( "link" );
            }

            // Create the codemirror object
            this.codemirror = CodeMirror.fromTextArea( this._element, {
                mode: "markdown",
                theme: "base16-light",
                tabSize: "2",
                indentWithTabs: true,
                lineNumbers: false,
                lineWrapping: true,
                autofocus: true,
                extraKeys: keyMaps
            });

            // Append statusbar
            if ( this._options.statusBar !== false ) {
                this._statusBar = new StatusBar( this._$wrapper,
                                                 this._options.statusBar );

                this.codemirror.on( "update", function() {
                    // Update line count
                    self._statusBar.setLineCount( self.codemirror.lineCount() );

                    // Update word count
                    self._statusBar.setWordCount(
                        gears.wordCount( self.codemirror ) );
                });

                this.codemirror.on( "cursorActivity", function() {
                    // Update cursor position
                    var pos = self.codemirror.getCursor();
                    self._statusBar.setCursorPosition( pos.line, pos.ch );
                });
            }

        };

        return Editor;

    });

})();
