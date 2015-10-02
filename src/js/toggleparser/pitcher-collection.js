/**
 * A pitcher collection
 */

import { Parser } from "commonmark";

import EventSpawner from "../utils/eventspawner.js";
import Helpers from "./helpers.js";

import StrongPitcher from "./pitchers/strongpitcher.js";
import EmPitcher from "./pitchers/empitcher.js";
import QuotePitcher from "./pitchers/quotepitcher.js";
import LinkPitcher from "./pitchers/linkpitcher.js";
import ImagePitcher from "./pitchers/imagepitcher.js";
import UnorderedListPitcher from "./pitchers/unorderedlistpitcher.js";
import OrderedListPitcher from "./pitchers/orderedlistpitcher.js";

import defaultState from "./default-state.js";


/**
 * Pitcher collection, acts as one unified pitcher
 */
export default class PitcherCollection extends EventSpawner {

    /**
     * Constructor
     */
    constructor( toggleParser ) {

        // Invoke spawner constructor
        super();

        this.toggleParser = toggleParser;

        this._parser = new Parser();

        this._pitcherCache = null;
    }

    /**
     * Perform a pitch
     */
    pitch() {

        // Needs external communication
        let state = this._stateObject;
        let selection = this.toggleParser.currentSelection;

        // All internal from now on
        let selectionContainer = Helpers.getSelectionContainer(
            selection, this._parser.parse( this.toggleParser.editor.value ) );

        for( let pitcher of this._pitchers ) {
            pitcher.selectionContainer = selectionContainer;
            pitcher.state = state;
            pitcher.selection = selection;
            pitcher.pitch();
        }

        // Return back to external
        this.trigger( "pitched", state );
    }

    /**
     * Lazy pitchers getter
     */
    get _pitchers() {

        if ( this._pitcherCache === null ) {
            this._pitcherCache = [
                new StrongPitcher(),
                new EmPitcher(),
                new QuotePitcher(),
                new LinkPitcher(),
                new ImagePitcher(),
                new UnorderedListPitcher(),
                new OrderedListPitcher()
            ];
        }

        return this._pitcherCache;
    }

    /**
     * get empty state object
     */
    get _stateObject() {
        return Object.assign( {}, defaultState );
    }

}
