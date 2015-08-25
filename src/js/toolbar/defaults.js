/**
 * The default tookbar config
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
            window.toolbar = window.toolbar || {};
            window.toolbar.defaults = factory();
        }

    })( window, function() {

        // Use array because order of objects is important
        var defaults = [];

        // Toolbar entries should be objects or false.
        // When an entry is false, it is a separator.
        // When an entry is an object, it is a button.
        //
        // Objects have the form of:
        // {
        //     name: "The name of the object, for use in the event callback"
        //           "(required)",
        //     iconClass: "The normal icon class. (Required)",
        //     activeIconClass: "The icon in active mode. (Optional)",
        //     title: "The normal text (Required)",
        //     activeTitle: "The title in active state"
        // }

        // The bold button
        defaults.push({
            name: "bold",
            iconClass: "jquery-markdown-editor-bold",
            title: "Bold"
        });

        // The italic button
        defaults.push({
            name: "italic",
            iconClass: "jquery-markdown-editor-italic",
            title: "Italic"
        });

        // A separator
        defaults.push( false );

        // A quote
        defaults.push({
            name: "quote",
            iconClass: "jquery-markdown-editor-quote-left",
            title: "Quote",
            activeTitle: "Unquote"
        });

        // A code block
        defaults.push({
            name: "code",
            iconClass: "jquery-markdown-editor-code",
            title: "Mark as code"
        });

        // A separator
        defaults.push( false );

        // An unordered list
        defaults.push({
            name: "ul",
            iconClass: "jquery-markdown-editor-list-bullet",
            title: "Unordered list"
        });

        // An ordered list
        defaults.push({
            name: "ol",
            iconClass: "jquery-markdown-editor-list-numbered",
            title: "Ordered list"
        });

        // A separator
        defaults.push( false );

        // A link
        defaults.push({
            name: "link",
            iconClass: "jquery-markdown-editor-link",
            activeIconClass: "jquery-markdown-editor-unlink",
            title: "Create link",
            activeTitle: "Remove link"
        });

        // An image
        defaults.push({
            name: "image",
            iconClass: "jquery-markdown-editor-picture",
            title: "Add image",
            activeTitle: "Remove image"
        });

        // A separator
        defaults.push( false );

        // Preview
        defaults.push({
            name: "preview",
            iconClass: "jquery-markdown-editor-eye",
            activeIconClass: "jquery-markdown-editor-eye-off",
            title: "Preview",
            activeTitle: "Exit preview"
        });

        // Help
        defaults.push({
            name: "help",
            iconClass: "jquery-markdown-editor-help",
            title: "Show help"
        });

        // Fullscreen
        defaults.push({
            name: "fullscreen",
            iconClass: "jquery-markdown-editor-resize-full",
            activeIconClass: "jquery-markdown-editor-resize-small",
            title: "Fullscreen",
            activeTitle: "Exit fullscreen"
        });

        return defaults;
    });

})();
