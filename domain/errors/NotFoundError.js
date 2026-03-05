'use strict';

/**
 * Domain error: the requested resource does not exist.
 */
class NotFoundError extends Error {
    /**
     * @param {string} message
     */
    constructor(message) {
        super(message);
        this.name = 'NotFoundError';
    }
}

module.exports = NotFoundError;
