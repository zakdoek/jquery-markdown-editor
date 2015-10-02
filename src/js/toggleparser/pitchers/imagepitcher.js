/**
 * Image pitcher
 */

import Pitcher from "./pitcher.js";
import Helpers from "../helpers.js";


/**
 * Runs tests and updates state object to expose the available actions
 * concerning images.
 */
export default class ImagePitcher extends Pitcher {

    /**
     * The pitching method
     */
    pitch() {

        // Is type (ancestors not relevant)
        if ( this.selectionContainer.type === "Image" ) {
            this.state.isImage = true;
            // If it is, it can
            this.state.canImage = true;
            return;
        }

        // Is not a node, should be empty or a clean selection to be ok.

        // If selection is multiblock, cannot be an image, so short circuit
        if ( !Helpers.isHighestLevelBlock( this.selectionContainer ) ) {
            return;
        }

        // If selection is empty => All is ok
        if ( Helpers.selectionIsEmpty( this.selection ) ) {
            this.state.canImage = true;
            return;
        }
    }

}
