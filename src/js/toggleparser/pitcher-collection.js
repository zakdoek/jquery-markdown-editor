/**
 * A pitcher collection
 */

import { Parser } from "commonmark";

import EventSpawner from "../utils/eventspawner.js";
import Helpers from "./helpers.js";

import StrongPitcher from "./strongpitcher.js";
import EmPitcher from "./empitcher.js";
import QuotePitcher from "./quotepitcher.js";

// State prototype
const defaultSelectionState = {

    // Check the validity of the selection
    canStrong: false,
    canEm: false,
    canQuote: false,
    canCode: false,
    canUl: false,
    canOl: false,
    canLink: false,
    canImage: false,

    // Check the value of the selection
    isStrong: false,
    isEm: false,
    isQuote: false,
    isCode: false,
    isUl: false,
    isOl: false,
    isLink: false,
    isImage: false

};


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

        this._pitchers = [];

        this._pitchers.push( new StrongPitcher() );
        this._pitchers.push( new EmPitcher() );
        this._pitchers.push( new QuotePitcher() );
    }

    /**
     * Perform a pitch
     */
    pitch() {

        // Needs external communication
        let state = Object.assign( {}, defaultSelectionState );
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

}
