/**
 * Test the status for unordered lists
 */

import Pitcher from "./pitcher.js";
import Helpers from "../helpers.js";


export default class UnorderedListPitcher extends Pitcher {

    /**
     * Effective pitching
     */
    pitch() {

        // Test active status
        let isList = Helpers.isOfTypeOrAncestors(
            this.selectionContainer, "List" );

        if ( isList ) {
            let listNode = Helpers.getHighestLevelNodeOfType(
                this.selectionContainer, "List" );
            if ( listNode.listType === "Bullet" ) {
                this.state.isUl = true;
                this.state.canUl = true;
            }
            // Button wil unlist rather than a nested list
            return;
        }

        // No list detected, so check where a list is creatable
        // Do thing pretty restrictive. Can only be contained inside a list if
        // cursor has no selection
        if ( Helpers.selectionIsEmpty( this.selection ) &&
             Helpers.isOfTypeOrAncestors( this.selectionContainer,
                                          "Paragraph" ) ) {
            this.state.canUl = true;
        }

    }

}
