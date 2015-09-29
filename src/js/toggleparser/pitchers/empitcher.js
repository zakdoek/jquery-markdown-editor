/**
 * Pitches for strong state
 */

import Pitcher from "./pitcher.js";
import Helpers from "../helpers.js";

export default class StrongPitcher extends Pitcher {

    /**
     * Pitches
     */
    pitch() {
        this.state.isEm = Helpers.isOfTypeOrAncestors( this.selectionContainer,
                                                       "Emph", true );
        // If self or ancestor is emph, can unemph toggle, so permit true.
        if ( this.state.isEm ) {
            this.state.canEm = true;
            // Early exit
            return;
        }

        // Shortcircuit on invalid blocks
        if ( this.selectionContainer.type === "Image" ||
             this.selectionContainer.type === "Link" ) {
            this.state.canEm = false;
            return;
        }

        // Detect multiblock selection
        if ( !Helpers.isHighestLevelBlock( this.selectionContainer ) ) {
            this.state.canEm = false;
            return;
        }

        // An empty selection has no use here
        if ( Helpers.selectionIsEmpty( this.selection ) ) {
            this.state.canEm = true;
            // Early exit
            return;
        }

        // Test if the selection contains an emph
        if ( !Helpers.selectionContainsTokenOfType(
                this.selection,
                this.selectionContainer, "Emph" ) ) {
            this.state.canEm = true;
        }
    }

}
