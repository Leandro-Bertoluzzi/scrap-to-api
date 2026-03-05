'use strict';

/**
 * Port: Browser Page
 *
 * Defines the contract for a single browser page/tab.
 */
class IPage {
    /**
     * Navigates to the given URL.
     * @param {string} url
     * @returns {Promise<{ status: number, redirected: boolean }>} HTTP status code and whether the navigation was redirected.
     */
    async goto(url) {
        throw new Error('IPage.goto() not implemented');
    }

    /**
     * Waits until an element matching the selector appears in the DOM.
     * @param {string} selector
     * @returns {Promise<void>}
     */
    async waitForSelector(selector) {
        throw new Error('IPage.waitForSelector() not implemented');
    }

    /**
     * Returns the trimmed inner text of every DOM element matching the selector.
     * @param {string} selector
     * @returns {Promise<string[]>}
     */
    async extractText(selector) {
        throw new Error('IPage.extractText() not implemented');
    }

    /**
     * Runs `pageFunction` in the browser context against all DOM nodes matching
     * `selector` and returns its serialisable result.
     *
     * @template T
     * @param {string}   selector      CSS selector to match elements.
     * @param {Function} pageFunction  Function executed in browser context; receives the
     *                                 matched NodeList as its first argument followed by
     *                                 any extra `args`.
     * @param {...*}     args          Serialisable arguments forwarded to `pageFunction`.
     * @returns {Promise<T>}
     */
    async evaluate(selector, pageFunction, ...args) {
        throw new Error('IPage.evaluate() not implemented');
    }

    /**
     * Closes the page and releases its resources.
     * @returns {Promise<void>}
     */
    async close() {
        throw new Error('IPage.close() not implemented');
    }
}

module.exports = IPage;
