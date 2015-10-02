/**
 * Action library
 */

import Strong from "./actions/strong.js";
import Emph from "./actions/emph.js";
import Quote from "./actions/quote.js";


/**
 * Standard actions library
 */
export default class ActionsLibrary {

    constructor( toggleParser ) {
        this.strong = new Strong( toggleParser );
        this.emph = new Emph( toggleParser );
        this.quote = new Quote( toggleParser );
    }
}
