/**
 * Some helper functions
 */

/**
 * Return the inverse of the current if bool is undefined
 */
export function toggleIfUndefined( bool, current ) {
    if ( typeof bool === "undefined" ) {
        return !current;
    } else {
        return !!bool;
    }
}
