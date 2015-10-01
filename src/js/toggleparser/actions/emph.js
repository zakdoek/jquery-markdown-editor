/**
 * Emphasis action
 */

import Action from "./action.js";


export default class Emph extends Action {

    /**
     * Test if any action is possible at all
     */
    test() {
        return this.parser.selectionState.canEm;
    }

    /**
     * Off action
     */
    _off() {
        // Toggle off
        /* global console */
        console.log( "Remove em" );
    }

    /**
     * On action
     */
    _on() {
        /* global console */
        console.log( "Wrap in em" );
    }

    /**
     * Toggle action
     */
    _toggle() {
        if ( this.parser.selectionState.isEm ) {
            this.off();
        } else {
            this.on();
        }
    }

}
