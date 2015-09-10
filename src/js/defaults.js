/**
 * Editor defaults
 */

import commonmark from "commonmark";

// The default help link
export const helpLink = "http://nextstepwebs.github.io/" +
                        "simplemde-markdown-editor/markdown-guide";

// Export the default renderer
const reader = new commonmark.Parser();
const writer = new commonmark.HtmlRenderer();
export const renderer = function( src ) {
    return writer.render( reader.parse( src ) );
};

export const toggleParserClass = false;

// Enable the toolbar by default
export const toolbar = true;

// Statusbar activated by default
export const statusBar = true;
