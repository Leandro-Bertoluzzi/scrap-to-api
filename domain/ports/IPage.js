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
     * @returns {Promise<number>} HTTP status code of the response.
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
     * Closes the page and releases its resources.
     * @returns {Promise<void>}
     */
    async close() {
        throw new Error('IPage.close() not implemented');
    }
}

module.exports = IPage;
