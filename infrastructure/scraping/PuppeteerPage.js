'use strict';

const IPage = require('../../domain/ports/IPage');

/**
 * Infrastructure adapter: Puppeteer implementation of IPage.
 * Wraps a raw Puppeteer page instance.
 *
 * @implements {IPage}
 */
class PuppeteerPage extends IPage {
    /**
     * @param {import('puppeteer').Page} page
     */
    constructor(page) {
        super();
        this._page = page;
    }

    async goto(url) {
        const response = await this._page.goto(url);

        // Get the redirect chain (an array of HTTPRequest objects)
        const redirectChain = response.request().redirectChain();

        const redirected = redirectChain.length > 0;
        return { status: response.status(), redirected };
    }

    async waitForSelector(selector) {
        return this._page.waitForSelector(selector);
    }

    async extractText(selector) {
        return this._page.$$eval(selector, (els) => els.map((el) => el.innerText.trim()));
    }

    async evaluate(selector, pageFunction, ...args) {
        return this._page.$$eval(selector, pageFunction, ...args);
    }

    async close() {
        return this._page.close();
    }
}

module.exports = PuppeteerPage;
