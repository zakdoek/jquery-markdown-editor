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
        state.isEm = Helpers.isOfTypeOrAncestors( selection, "Emph",
                                                        true );
        // If self or ancestor is emph, can unemph toggle, so permit true.
        if ( state.isEm ) {
            state.canEm = true;
            // Early exit
            return;
        }

        // Shortcircuit on invalid blocks
        if ( selection.type === "Image" || selection.type === "Link" ) {
            state.canEm = false;
            return;
        }

        // Detect multiblock selection
        if ( !Helpers.isHighestLevelBlock( selection ) ) {
            state.canEm = false;
            return;
        }

        // An empty selection has no use here
        if ( this.parser.selectionIsEmpty() ) {
            state.canEm = true;
            // Early exit
            return;
        }

        // Test if the selection contains an emph
        if ( !this.parser.selectionContainsTokenOfType( selection, "Emph" ) ) {
            state.canEm = true;
        }
    }

}
