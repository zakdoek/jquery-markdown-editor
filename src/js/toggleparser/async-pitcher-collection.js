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

        this._isBusy = false;
        this._shouldRetrigger = false;

        this._worker = workerFactory(
            require( "./async-pitcher-collection-worker.js" )
        );

        this._worker.addEventListener( "message", ( event ) => {
            this.trigger( "pitched", event.data );
            this._isBusy = false;

            if ( this._shouldRetrigger ) {
                this._shouldRetrigger = false;
                this.pitch();
            }
        });

    }

    /**
     * Pitch via a worker
     */
    pitch() {
        if ( this._isBusy ) {
            this._shouldRetrigger = true;
        } else {
            this._isBusy = true;
            this._worker.postMessage({
                selection: this.toggleParser.currentSelection,
                value: this.toggleParser.editor.value
            });
        }
    }

}

let dynamicPitcherCollection = PitcherCollection;

if ( window.Worker ) {
    dynamicPitcherCollection = ThreadedPitcherCollection;
}

export default dynamicPitcherCollection;
