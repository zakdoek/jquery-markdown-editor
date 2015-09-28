/**
 * Pitch for quotes
 */

import Pitcher from "./pitcher.js";
import Helpers from "./helpers.js";

export default class QuotePitcher extends Pitcher {

    /**
     * Pitch for quotes
     */
    pitch( state ) {
        let selection = this.parser.selectionContainer;
        // Try to bubble to the quote
        state.isQuote = Helpers.isOfTypeOrAncestors(
            selection, "BlockQuote", false );

        // If of type quote, one can unquote
        if ( state.isQuote ) {
            state.canQuote = true;
            return;
        }

        // Detect where a quote can be inserted
        if ( Helpers.isOfTypeOrAncestors(
                selection, "Paragraph", false ) ) {

            if ( !Helpers.isOfTypeOrAncestors(
                    selection, "List", false ) ) {
                state.canQuote = true;
                return;
            }
        }
    }

}
