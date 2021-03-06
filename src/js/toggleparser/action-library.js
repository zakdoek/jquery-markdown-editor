/**
 * Action library
 */

import Strong from "./actions/strong.js";
import Emph from "./actions/emph.js";
import Quote from "./actions/quote.js";
import UnorderedList from "./actions/unordered-list.js";
import OrderedList from "./actions/ordered-list.js";
import Link from "./actions/link.js";


/**
 * Standard actions library
 */
export default class ActionsLibrary {

    constructor( toggleParser ) {
        this.strong = new Strong( toggleParser );
        this.emph = new Emph( toggleParser );
        this.quote = new Quote( toggleParser );
        this.unorderedList = new UnorderedList( toggleParser );
        this.orderedList = new OrderedList( toggleParser );
        this.link = new Link( toggleParser );
    }
}
