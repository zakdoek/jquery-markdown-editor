/**
 * Pitch for quotes
 */

import Pitcher from "./pitcher.js";
import Helpers from "./helpers.js";

export default class QuotePitcher extends Pitcher {

    /**
     * Pitch for quotes
     */
    pitch() {
        // Try to bubble to the quote
        this.state.isQuote = Helpers.isOfTypeOrAncestors(
            this.selectionContainer, "BlockQuote", false );

        // If of type quote, one can unquote
        if ( this.state.isQuote ) {
            this.state.canQuote = true;
            return;
        }

        // Detect where a quote can be inserted
        if ( Helpers.isOfTypeOrAncestors(
                this.selectionContainer, "Paragraph", false ) ) {

            if ( !Helpers.isOfTypeOrAncestors(
                    this.selectionContainer, "List", false ) ) {
                this.state.canQuote = true;
                return;
            }
        }
    }

}
