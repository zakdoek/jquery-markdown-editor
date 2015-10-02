/**
 * The async pitcher collection worker
 */

import { Parser } from "commonmark";

import Helpers from "./helpers.js";

import StrongPitcher from "./pitchers/strongpitcher.js";
import EmPitcher from "./pitchers/empitcher.js";
import QuotePitcher from "./pitchers/quotepitcher.js";
import LinkPitcher from "./pitchers/linkpitcher.js";
import ImagePitcher from "./pitchers/imagepitcher.js";
import UnorderedListPitcher from "./pitchers/unorderedlistpitcher.js";
import OrderedListPitcher from "./pitchers/orderedlistpitcher.js";

import defaultState from "./default-state.js";


export default function( worker ) {

    let parser = new Parser();

    let pitchers = [
        new StrongPitcher(),
        new EmPitcher(),
        new QuotePitcher(),
        new LinkPitcher(),
        new ImagePitcher(),
        new UnorderedListPitcher(),
        new OrderedListPitcher()
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
