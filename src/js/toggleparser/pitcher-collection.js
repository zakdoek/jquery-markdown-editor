/**
 * A pitcher collection
 */

import Pitcher from "./pitcher.js";
import StrongPitcher from "./strongpitcher.js";
import EmPitcher from "./empitcher.js";
import QuotePitcher from "./quotepitcher.js";


/**
 * Pitcher collection, acts as one unified pitcher
 */
export default class PitcherCollection extends Pitcher {

    /**
     * Constructor
     */
    constructor( parser ) {
        super( parser );
        this._pitchers = [];

        this._pitchers.push( new StrongPitcher( parser ) );
        this._pitchers.push( new EmPitcher( parser ) );
        this._pitchers.push( new QuotePitcher( parser ) );
    }

    /**
     * Perform a pitch
     */
    pitch( state ) {
        for( let pitcher of this._pitchers ) {
            pitcher.pitch( state );
        }
    }

}
