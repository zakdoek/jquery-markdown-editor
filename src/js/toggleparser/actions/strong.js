/**
 * Strong action
 */

import Action from "./action.js";


export default class Strong extends Action {

    /**
     * Test if action
     */
    test() {
        return this.parser.selectionState.canStrong;
    }

    /**
     * Off action
     */
    _off() {
        // Toggle off
        /* global console */
        console.log( "Remove strong" );
    }

    /**
     * On action
     */
    _on() {
        /* global console */
        console.log( "Wrap in strong" );
    }

    /**
     * Toggle action
     */
    _toggle() {
        if ( this.parser.selectionState.isStrong ) {
            this.off();
        } else {
            this.on();
        }
    }

}
