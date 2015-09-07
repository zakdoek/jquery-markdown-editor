/**
 * Creates a button
 */

import $ from "jquery";

import BoldButton from "./boldbutton.js";
import ItalicButton from "./italicbutton.js";
import QuoteButton from "./quotebutton.js";
import CodeButton from "./codebutton.js";
import UnorderedListButton from "./unorderedlistbutton.js";
import OrderedListButton from "./orderedlistbutton.js";
import LinkButton from "./linkbutton.js";
import ImageButton from "./imagebutton.js";
import PreviewButton from "./previewbutton.js";
import HelpButton from "./helpbutton.js";
import FullscreenButton from "./fullscreenbutton.js";
import CustomButton from "./custombutton.js";

const SEPARATOR = "separator";

const STOCK_BUTTONS = new Map();
STOCK_BUTTONS.set( "bold", BoldButton );
STOCK_BUTTONS.set( "italic", ItalicButton );
STOCK_BUTTONS.set( "quote", QuoteButton );
STOCK_BUTTONS.set( "code", CodeButton );
STOCK_BUTTONS.set( "unorderedlist", UnorderedListButton );
STOCK_BUTTONS.set( "orderedlist", OrderedListButton );
STOCK_BUTTONS.set( "link", LinkButton );
STOCK_BUTTONS.set( "image", ImageButton );
STOCK_BUTTONS.set( "preview", PreviewButton );
STOCK_BUTTONS.set( "help", HelpButton );
STOCK_BUTTONS.set( "fullscreen", FullscreenButton );

/**
 * Returns a button from library, options or a separator
 */
export default function buttonFactory( options, toolbar ) {
    if ( typeof options === "string" ) {
        if ( options === SEPARATOR ) {
            // Add a separator to the toolbar
            let $separator = $( "<i>|</i>" );
            $separator.addClass( SEPARATOR );
            toolbar.$element.append( $separator );
            // And return false
            return false;
        }

        // Test for library
        if ( STOCK_BUTTONS.has( options ) ) {
            // Add the button
            return new ( STOCK_BUTTONS.get( options ) )( toolbar );
        }
        // Throw exception if neccesary
        throw new Error( "The button " + options + " is no stock button." );
    } else {
        // Create a custom button from options object
        return new CustomButton( toolbar, options );
    }
}
