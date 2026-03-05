'use strict';

/**
 * Domain error: the upstream source failed unexpectedly.
 */
class UpstreamError extends Error {
    /**
     * @param {string} message
     */
    constructor(message) {
        super(message);
        this.name = 'UpstreamError';
    }
}

module.exports = UpstreamError;
