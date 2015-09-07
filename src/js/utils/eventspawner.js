/**
 * A generic event spawner mixin
 *
 * Provides a on method for registering and trigger method for triggering
 */
export default class EventSpawner {

    /**
     * The constructor
     */
    constructor() {
        // Init the registry
        this._listeners = {};
    }

    /**
     * The on method
     */
    on( event, callback ) {
        if ( !( event in this._listeners ) ) {
            this._listeners[ event ] = [];
        }

        this._listeners[ event ].push( callback.bind( this ) );
    }

    /**
     * The trigger method
     */
    trigger( event ) {
        if( event in this._listeners ) {
            for ( let callback of this._listeners[ event ] ) {
                callback();
            }
        }
    }

}
