/**
 * The code pitcher.
 *
 * This pitcher has a special status since it shoud be aware of inline code and
 * block level code.
 */

import Pitcher from "./pitcher.js";


export default class CodePitcher extends Pitcher {

    /**
     * Effective pitching
     */
    pitch() {

        // Test for Code or CodeBlock node

        // Note other inlines do not work in code elements
        // So => Can be contained but cannot contain

    }

}
