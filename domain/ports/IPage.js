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
     * Returns the trimmed inner text of anime cards, filtered by the header text
     * of each list container.
     *
     * Each `containerSelector` element must contain a `headerSelector` child whose
     * text is compared against the `headers` array.  When `headers` is null every
     * container is included.
     *
     * @param {string}        containerSelector  Selector for the list container elements.
     * @param {string}        headerSelector     Selector for the header element inside each container.
     * @param {string}        itemSelector       Selector for the card elements inside each container.
     * @param {string[]|null} headers            Allowed header texts, or null to include all containers.
     * @returns {Promise<Array<{ text: string, header: string }>>}
     */
    async extractTextByHeader(containerSelector, headerSelector, itemSelector, headers) {
        throw new Error('IPage.extractTextByHeader() not implemented');
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
