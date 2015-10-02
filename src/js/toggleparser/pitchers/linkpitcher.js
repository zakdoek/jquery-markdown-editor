/**
 * Pitch link status
 */

import Pitcher from "./pitcher.js";
import Helpers from "../helpers.js";


/**
 * Pitches if a link is selected and or an action can be performed on it
 */
export default class LinkPitcher extends Pitcher {

    /**
     * Pitcher entry point
     */
    pitch() {

        // Pitch if selection is a link
        this.state.isLink = Helpers.isOfTypeOrAncestors(
            this.selectionContainer, "Link", true );

        // Self or ancestors is link so can unlink
        if ( this.state.isLink ) {
            this.state.canLink = true;
            // Early exit
            return;
        }

        // What to do with image nodes? Can only be wrapped. Cannot contain!
        // So shortcircuit if selected node is image
        if ( this.selectionContainer.type === "Image" ) {
            return;
        }

        // If selection is multiblock, cannot be a link, so short circuit
        if ( !Helpers.isHighestLevelBlock( this.selectionContainer ) ) {
            return;
        }

        // Empty selection has no use here
        if ( Helpers.selectionIsEmpty( this.selection ) ) {
            // Early exit
            return;
        }

        // Test if selection of children is not fully overlapping
        if ( Helpers.childContainerIsPartiallySelected(
                this.selection, this.selectionContainer ) ) {
            return;
        }

        // Test if the selection already contains a link
        if ( !Helpers.selectionContainsTokenOfType(
                this.selection, this.selectionContainer,
                "Link" ) ) {
            this.state.canLink = true;
        }

    }

}
