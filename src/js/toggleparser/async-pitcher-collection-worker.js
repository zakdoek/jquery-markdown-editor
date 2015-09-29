/**
 * The async pitcher collection worker
 */

import { Parser } from "commonmark";

import Helpers from "./helpers.js";

import StrongPitcher from "./strongpitcher.js";
import EmPitcher from "./empitcher.js";
import QuotePitcher from "./quotepitcher.js";

import defaultState from "./default-state.js";


export default function( worker ) {

    let parser = new Parser();

    let pitchers = [
        new StrongPitcher(),
        new EmPitcher(),
        new QuotePitcher()
    ];

    worker.addEventListener( "message", function( event ) {

        let state = Object.assign( {}, defaultState );
        let selectionContainer = Helpers.getSelectionContainer(
            event.data.selection,
            parser.parse( event.data.value )
        );

        for( let pitcher of pitchers ) {
            pitcher.selectionContainer = selectionContainer;
            pitcher.state = state;
            pitcher.selection = event.data.selection;
            pitcher.pitch();
        }

        worker.postMessage( state );

    });

}
