'use strict';

const IBrowser = require('../../../../domain/ports/IBrowser');

/**
 * Test double: fake implementation of IBrowser.
 * Returns a pre-configured FakePage instance from newPage().
 *
 * @implements {IBrowser}
 */
class FakeBrowser extends IBrowser {
    /**
     * @param {import('./FakePage')} page
     */
    constructor(page) {
        super();
        this._page = page;
    }

    async start() {
        return this;
    }

    async newPage() {
        return this._page;
    }

    async close() {
        // no-op
    }
}

module.exports = FakeBrowser;
