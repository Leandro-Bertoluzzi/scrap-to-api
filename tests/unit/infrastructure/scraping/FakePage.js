'use strict';

const IPage = require('../../../../domain/ports/IPage');

/**
 * Test double: fake implementation of IPage.
 * Configurable with fixture data for use in unit tests.
 *
 * @implements {IPage}
 */
class FakePage extends IPage {
    /**
     * @param {{ items?: string[], statusCode?: number, redirected?: boolean }} options
     */
    constructor({ items = [], statusCode = 200, redirected = false } = {}) {
        super();
        this._items = items;
        this._statusCode = statusCode;
        this._redirected = redirected;
        /** @type {string|null} Last URL passed to goto(). Useful for assertions. */
        this.visitedUrl = null;
    }

    async goto(url) {
        this.visitedUrl = url;
        return { status: this._statusCode, redirected: this._redirected };
    }

    async waitForSelector(_selector) {
        // no-op
    }

    async extractText(_selector) {
        return this._items;
    }

    async evaluate(_selector, _pageFunction, ..._args) {
        // Ignore the pageFunction (DOM-only); return pre-configured items normalised
        // to the {text, header} shape.
        return this._items.map((item) =>
            typeof item === 'string' ? { text: item, header: '' } : item,
        );
    }

    async close() {
        // no-op
    }
}

module.exports = FakePage;
