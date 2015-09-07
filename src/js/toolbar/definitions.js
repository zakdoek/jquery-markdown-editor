/**
 * The default toolbar definitions
 */

// Use array because order of objects is important
let definitions = [];

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
definitions.push({
    name: "bold",
    iconClass: "jquery-markdown-editor-bold",
    title: "Bold"
});

// The italic button
definitions.push({
    name: "italic",
    iconClass: "jquery-markdown-editor-italic",
    title: "Italic"
});

// A separator
definitions.push( false );

// A quote
definitions.push({
    name: "quote",
    iconClass: "jquery-markdown-editor-quote-left",
    title: "Quote",
    activeTitle: "Unquote"
});

// A code block
definitions.push({
    name: "code",
    iconClass: "jquery-markdown-editor-code",
    title: "Mark as code"
});

// A separator
definitions.push( false );

// An unordered list
definitions.push({
    name: "ul",
    iconClass: "jquery-markdown-editor-list-bullet",
    title: "Unordered list"
});

// An ordered list
definitions.push({
    name: "ol",
    iconClass: "jquery-markdown-editor-list-numbered",
    title: "Ordered list"
});

// A separator
definitions.push( false );

// A link
definitions.push({
    name: "link",
    iconClass: "jquery-markdown-editor-link",
    activeIconClass: "jquery-markdown-editor-unlink",
    title: "Create link",
    activeTitle: "Remove link"
});

// An image
definitions.push({
    name: "image",
    iconClass: "jquery-markdown-editor-picture",
    title: "Add image",
    activeTitle: "Remove image"
});

// A separator
definitions.push( false );

// Preview
definitions.push({
    name: "preview",
    iconClass: "jquery-markdown-editor-eye",
    activeIconClass: "jquery-markdown-editor-eye-off",
    title: "Preview",
    activeTitle: "Exit preview"
});

// Help
definitions.push({
    name: "help",
    iconClass: "jquery-markdown-editor-help",
    title: "Show help"
});

// Fullscreen
definitions.push({
    name: "fullscreen",
    iconClass: "jquery-markdown-editor-resize-full",
    activeIconClass: "jquery-markdown-editor-resize-small",
    title: "Fullscreen",
    activeTitle: "Exit fullscreen"
});

export default definitions;
