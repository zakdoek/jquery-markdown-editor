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
        this.state.isStrong = Helpers.isOfTypeOrAncestors(
            this.selectionContainer, "Strong", true );

        // If self or ancestor is strong, can unstrong toggle, so permit true.
        if ( this.state.isStrong ) {
            this.state.canStrong = true;
            // Early exit
            return;
        }

        // Shortcircuit on invalid blocks
        if ( this.selectionContainer.type === "Image" ) {
            this.state.canStrong = false;
            return;
        }

        // Detect multiblock selection
        if ( !Helpers.isHighestLevelBlock( this.selectionContainer ) ) {
            this.state.canStrong = false;
            return;
        }

        // An empty selection has no use here
        if ( Helpers.selectionIsEmpty( this.selection ) ) {
            this.state.canStrong = false;
            // Early exit
            return;
        }

        // Test if selection of children is not fully overlapping
        if ( Helpers.childContainerIsPartiallySelected(
                this.selection, this.selectionContainer ) ) {
            return;
        }

        // Test if the selection contains a strong
        if ( !Helpers.selectionContainsTokenOfType(
                this.selection, this.selectionContainer,
                "Strong" ) ) {
            this.state.canStrong = true;
        }

        // Test for links if selection is inside link
        if ( this.selectionContainer.type === "Link" ) {
            if ( !Helpers.selectionIsLimitedToContent(
                    this.selection, this.selectionContainer ) ) {
                this.state.canStrong = false;
            }
        }
    }

}
