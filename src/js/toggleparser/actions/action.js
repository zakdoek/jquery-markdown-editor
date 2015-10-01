/**
 * Abstract action
 */


/**
 * Abstract action iface
 */
export default class Action {

    /**
     * constructor
     */
    constructor( parser ) {
        this.parser = parser;
    }

    /**
     * Test if any action is possible at all
     */
    test() {
        return true;
    }

    /**
     * Enable the effect
     */
    on() {
        if ( this.test() ) {
            return this._on.apply( this, arguments );
        }
    }

    /**
     * Disable the effect
     */
    off() {
        if ( this.test() ) {
            return this._off.apply( this, arguments );
        }
    }

    /**
     * Toggle the effect
     */
    toggle() {
        if ( this.test() ) {
            return this._toggle.apply( this, arguments );
        }
    }

    /**
     * Enable the effect
     */
    _on() {}

    /**
     * Disable the effect
     */
    _off() {}

    /**
     * Toggle the effect
     */
    _toggle() {}

}
