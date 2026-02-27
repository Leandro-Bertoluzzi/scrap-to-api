'use strict';

/**
 * Port: Browser
 *
 * Defines the contract for a headless browser capable of opening and closing pages.
 * Infrastructure adapters must extend this class and implement all methods.
 */
class IBrowser {
    /** Launches the browser. Resolves when ready. */
    async start() {
        throw new Error('IBrowser.start() not implemented');
    }

    /** Opens a new page/tab and returns it. */
    async newPage() {
        throw new Error('IBrowser.newPage() not implemented');
    }

    /** Closes the browser and releases all resources. */
    async close() {
        throw new Error('IBrowser.close() not implemented');
    }
}

module.exports = IBrowser;
