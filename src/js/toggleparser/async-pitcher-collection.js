/**
 * Pitcher collection that does a pitcher through a web worker
 */

import PitcherCollection from "./pitcher-collection.js";
import workerFactory from "webworkify";


class ThreadedPitcherCollection extends PitcherCollection {

    /**
     * Constructor
     */
    constructor( toggleParser ) {

        super( toggleParser );

        this._worker = workerFactory(
            require( "./async-pitcher-collection-worker.js" )
        );

        this._worker.addEventListener( "message", ( event ) => {
            this.trigger( "pitched", event.data );
        });

    }

    /**
     * Pitch via a worker
     */
    pitch() {
        this._worker.postMessage({
            selection: this.toggleParser.currentSelection,
            value: this.toggleParser.editor.value
        });
    }

}

let dynamicPitcherCollection = PitcherCollection;

if ( window.Worker ) {
    dynamicPitcherCollection = ThreadedPitcherCollection;
}

export default dynamicPitcherCollection;
