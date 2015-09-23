/**
 * Pitches for strong state
 */

import Pitcher from "./pitcher.js";
import Helpers from "./helpers.js";

export default class StrongPitcher extends Pitcher {

    /**
     * Pitches
     */
    pitch( state ) {
        let selection = this.parser.selectionContainer;
        state.isStrong = Helpers.isOfTypeOrAncestors( selection,
                                                           "Strong", true );

        // If self or ancestor is strong, can unstrong toggle, so permit true.
        if ( state.isStrong ) {
            state.canStrong = true;
            // Early exit
            return;
        }

        // Shortcircuit on invalid blocks
        if ( selection.type === "Image" || selection.type === "Link" ) {
            state.canStrong = false;
            return;
        }

        // Detect multiblock selection
        if ( !Helpers.isHighestLevelBlock( selection ) ) {
            state.canStrong = false;
            return;
        }

        // An empty selection has no use here
        if ( this._selectionIsEmpty() ) {
            state.canStrong = true;
            // Early exit
            return;
        }

        // Test if the selection contains a strong
        if ( !this._selectionContainsTokenOfType( selection, "Strong" ) ) {
            state.canStrong = true;
        }
    }

}
