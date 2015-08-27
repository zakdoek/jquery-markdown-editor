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
             "./defaults",
             "./utils/types",
             "./toolbar/class",
             "./statusbar/class",
             "./language-helpers/bold",
             "CodeMirror/lib/codemirror",
             "CodeMirror/addon/edit/continuelist",
             "./tab-continuelist",
             "CodeMirror/mode/xml/xml",
             "CodeMirror/mode/markdown/markdown"
         ], function( $, gears, defaults, types, Toolbar, StatusBar,
                      lhBold, CodeMirror ) {
             return factory( $, gears, defaults, types, Toolbar, StatusBar,
                             lhBold, CodeMirror );
         });
     } else if ( typeof exports === "object" ) {
         // CommonJS
         module.exports = factory(
             require( "jquery" ),
             require( "./gears" ),
             require( "./defaults" ),
             require( "./utils/types" ),
             require( "./toolbar/class" ),
             require( "./statusbar/class" ),
             require( "./language-helpers/bold" ),
             require( "CodeMirror/lib/codemirror" ),
             require( "CodeMirror/addon/edit/continuelist" ),
             require( "./tab-continuelist" ),
             require( "CodeMirror/mode/xml/xml" ),
             require( "CodeMirror/mode/markdown/markdown" )
         );
     } else {
         // browser global
        window.jqueryMarkdownEditor = window.jqueryMarkdownEditor || {};
         window.jqueryMarkdownEditor.Editor = factory(
             window.jQuery,
             window.jqueryMarkdownEditor.gears,
             window.jqueryMarkdownEditor.defaults,
             window.jqueryMarkdownEditor.utils.types,
             window.jqueryMarkdownEditor.toolbar.Toolbar,
             window.jqueryMarkdownEditor.statusBar.StatusBar,
             window.jqueryMarkdownEditor.languageHelpers.bold,
             window.CodeMirror );
     }

    })( window, function( $, gears, defaults, types, Toolbar, StatusBar,
                          lhBold, CodeMirror ) {

        // line starts with number test
        var LINE_STARTS_WITH_NUMBER = /^\s*\d+\.\s/;

        /**
         * Interface of Editor.
         */
        function Editor( options ) {
            // Mix with default options
            this._options = $.extend( {}, defaults, options );

            // Short circuit. A text area element is the minimum requirement
            // TODO: Add test if element is text area
            if ( types.isUndefined( this._options.element ) ) {
                return;
            }

            // Set the initial fullscreen option
            this._isFullscreen = false;

            // Set the initial preview variables
            this._isPreview = false;
            this._$previewContainer = false;

            // Just for docs, will be created and populated later
            this._$wrapper = false;

            // Store the element for reference
            this._element = this._options.element;

            // Initialize the editor
            this._init();
        }

        /**
         * Initialize the editor
         */
        Editor.prototype._init = function() {

            var keyMaps = {};
            // TODO: Add extra keymaps
            keyMaps.Enter = "newlineAndIndentContinueMarkdownList";
            keyMaps.Tab = "tabAndIndentContinueMarkdownList";
            keyMaps[ "Shift-Tab" ] = "shiftTabAndIndentContinueMarkdownList";

            // Wrap the element
            this._$wrapper = $( this._element ).wrap( "<div></div>" ).parent();
            this._$wrapper.addClass( "jquery-markdown-editor" );

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

            // setup toolbar
            this._initToolbar();

            // setup status bar
            this._initStatusBar();

            // setup fullscreen
            this._initFullscreen();

            // setup preview
            this._initPreview();

        };

        /**
         * Init the toolbar
         */
        Editor.prototype._initToolbar = function() {

            // short circuit
            if ( this._options.toolbar === false ) {
                return;
            }

            var self = this;

            // Add the toolbar
            this._toolbar = new Toolbar( this._$wrapper,
                                         this._options.toolbar );

            // Register listener
            this._toolbar.addActionListener(function( buttonId ) {
                self._processActions( buttonId );
            });

            // Register button state updaters
            this.codemirror.on( "cursorActivity", function() {

                // Set bold state
                self._toolbar.setActive( "bold", lhBold.test( self ) );

                // var state = self._getSelectionState();

                // // Bold button
                // self._toolbar.setActive(
                //     "bold", $.inArray( "strong", state ) !== -1 );
                // // Italics button
                // self._toolbar.setActive(
                //     "italic", $.inArray( "em", state ) !== -1 );

                // // Quote
                // self._toolbar.setActive(
                //     "quote", $.inArray( "quote", state ) !== -1 );

                // // Ordered list
                // self._toolbar.setActive(
                //     "ol", $.inArray( "ol", state ) !== -1 );

                // // Unordered list
                // self._toolbar.setActive(
                //     "ul", $.inArray( "ul", state ) !== -1 );

                // // TODO: Support all states

            });
        };

        /**
         * Init status bar
         */
        Editor.prototype._initStatusBar = function() {
            // Short circuit
            if ( this._options.statusBar === false ) {
                return;
            }

            var self = this;

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
        };

        /**
         * Init fullscreen functionality
         */
        Editor.prototype._initFullscreen = function() {

            var self = this;

            // Set up resizing for fullscreen stuff
            $( window ).resize(function() {
                if ( self._isFullscreen ) {
                    var targetHeight = $( window ).height();
                    targetHeight -= self._toolbar.getHeight();
                    targetHeight -= self._statusBar.getHeight();
                    self.codemirror.setSize( null, targetHeight  );
                }
            });

        };

        /**
         * Init the preview functionality
         */
        Editor.prototype._initPreview = function() {
            this._$previewContainer = $( "<div></div" );
            this._$previewContainer.addClass( "preview-container modal" );

            this._$previewContent = $( "<div></div>" );
            this._$previewContent.addClass( "content" );
            this._$previewContainer.append( this._$previewContent );

            // Add it
            $( this.codemirror.getWrapperElement() ).append(
                this._$previewContainer );
        };

        /**
         * Process toolbar events
         */
        Editor.prototype._processActions = function( actionId ) {

            // Handle preview
            if( actionId === "preview" ) {
                this.togglePreview();
                return;
            }

            // Handle fullscreen
            if ( actionId === "fullscreen" ) {
                this.toggleFullscreen();
                return;
            }

            // Handle help
            if ( actionId === "help" ) {
                this._showHelpLink();
                return;
            }

            // Ignore below if preview mode is enabled
            if ( this._isPreview ) {
                // Exit
                return;
            }

            // Bold
            if ( actionId === "bold" ) {
                this._toggleBold();
                // Exit
                return;
            }
        };

        /**
         * Toggle bold
         *
         * TODO: Seriously optimize
         */
        Editor.prototype._toggleBlock = function( type, openChars, closeChars) {

            closeChars = types.isDefined( closeChars ) ? closeChars : openChars;

            var cm = this.codemirror;

            var text;
            var start = openChars;
            var end = closeChars;

            var startPoint = cm.getCursor( "from" );
            var endPoint = cm.getCursor( "to" );

            // Test state
            if ( $.inArray( type, this._getSelectionState() ) ) {

                // Remove the block
                text = cm.getLine(startPoint.line);

                start = text.slice(0, startPoint.ch);
                end = text.slice(startPoint.ch);
                if( type === "bold" ) {
                    start = start.replace(/(\*\*|__)(?![\s\S]*(\*\*|__))/, "");
                    end = end.replace(/(\*\*|__)/, "");
                } else if( type === "italic" ) {
                    start = start.replace(/(\*|_)(?![\s\S]*(\*|_))/, "");
                    end = end.replace(/(\*|_)/, "");
                }
                cm.replaceRange(start + end, {
                    line: startPoint.line,
                    ch: 0
                }, {
                    line: startPoint.line,
                    ch: 99999999999999
                });

                if( type === "bold" ) {
                    startPoint.ch -= 2;
                    endPoint.ch -= 2;
                } else if(type === "italic") {
                    startPoint.ch -= 1;
                    endPoint.ch -= 1;
                }
            } else {
                // Add the block
                text = cm.getSelection();
                if( type === "bold" ) {
                    text = text.split( "**" ).join( "" );
                    text = text.split("__").join( "" );
                } else if( type === "italic" ) {
                    text = text.split("*").join( "" );
                    text = text.split("_").join( "" );
                }
                cm.replaceSelection(start + text + end);

                startPoint.ch += openChars.length;
                endPoint.ch = startPoint.ch + text.length;
            }

            cm.setSelection(startPoint, endPoint);
            cm.focus();
        };

        /**
         * Show help link
         */
        Editor.prototype._showHelpLink = function() {

            if ( !!this._options.helpLink ) {
                window.open( this._options.helpLink );
            }

        };

        /**
         * Get the state of the selection.
         *
         * TODO: Find a more robust and complete way
         */
        Editor.prototype._getSelectionState = function() {

            var self = this,
                cursorPosition = this.codemirror.getCursor( "start" ),
                tokenTypes = this.codemirror.getTokenTypeAt( cursorPosition ),
                result = [];

            // Could not recognise, exit
            if ( !tokenTypes ) {
                return result;
            }

            // Process token types
            $.each( tokenTypes.split( " " ), function( index, value ) {

                // Map variable 2 to lists
                if ( value === "variable-2" ) {
                    // Fetch full line
                    var line = self.codemirror.getLine( cursorPosition.line );

                    // Test if starts with a number
                    if ( LINE_STARTS_WITH_NUMBER.test( line ) ) {
                        // Mark ordered list
                        result.push( "ol" );
                    } else {
                        // Mark unordered list
                        result.push( "ul" );
                    }
                    return; // Short circuit
                }

                // TODO: Catch link

                // TODO: Catch code ( inline or not )

                // TODO: Catch image

                // Catch all
                result.push( value );

            });

            // Return result
            return result;

        };

        /**
         * Activate/Deactivate fullscreen
         */
        Editor.prototype.toggleFullscreen = function() {

            // Change state
            this._isFullscreen = !this._isFullscreen;

            // Short circuit
            if ( this._isFullscreen ) {
                // Activate
                this._$wrapper.addClass( "fullscreen" );
                // Set toolbar
                this._toolbar.markActive( "fullscreen" );
                // Set editor to full size
                var targetHeight = $( window ).height();
                targetHeight -= this._toolbar.getHeight();
                targetHeight -= this._statusBar.getHeight();
                this.codemirror.setSize( null, targetHeight  );
            } else {
                // Deactivate
                this._$wrapper.removeClass( "fullscreen" );
                // Set toolbar
                this._toolbar.markNotActive( "fullscreen" );
                // Clear the size
                this.codemirror.setSize( null, "" );
            }
        };

        /**
         * Toggle the preview function
         */
        Editor.prototype.togglePreview = function() {

            var self = this;

            // Switch state
            this._isPreview = !this._isPreview;

            if ( this._isPreview ) {
                // Activate preview

                // Disable buttons
                // TODO: Find a more extensible sollution
                var toDisable = $.grep(
                    this._toolbar.listButtons(), function( value ) {
                    return $.inArray( value, [
                        "preview", "help", "fullscreen" ] ) === -1;
                });

                $.each( toDisable, function( idx, value ) {
                    self._toolbar.disableButton( value );
                });

                // Activate preview button
                this._toolbar.markActive( "preview" );

                // Render the current value to the preview container
                if ( !!this._options.renderer ) {
                    this._$previewContent.html( this._options.renderer(
                        this.codemirror.getValue() ) );
                } else {
                    this._$previewContent.text( "No renderer." );
                }

                // Set class
                this._$previewContainer.addClass( "active" );

            } else {
                // Deactivate

                // Enable all buttons
                $.each( self._toolbar.listButtons(), function( idx, value ) {
                    self._toolbar.enableButton( value );
                });

                // Deactivate preview button
                this._toolbar.markNotActive( "preview" );

                // Set class
                this._$previewContainer.removeClass( "active" );
            }

        };

        return Editor;

    });

})();
