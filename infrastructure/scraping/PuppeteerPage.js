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
        return response.status();
    }

    async waitForSelector(selector) {
        return this._page.waitForSelector(selector);
    }

    async extractText(selector) {
        return this._page.$$eval(selector, (els) => els.map((el) => el.innerText.trim()));
    }

    async extractTextByHeader(containerSelector, headerSelector, itemSelector, headers) {
        return this._page.$$eval(
            containerSelector,
            (containers, headerSel, itemSel, allowedHeaders) => {
                const allowed = allowedHeaders ? new Set(allowedHeaders) : null;
                return containers
                    .filter((container) => {
                        if (!allowed) return true;
                        const header = container.querySelector(headerSel);
                        return header && allowed.has(header.innerText.trim());
                    })
                    .flatMap((container) =>
                        Array.from(container.querySelectorAll(itemSel)).map((el) =>
                            el.innerText.trim(),
                        ),
                    );
            },
            headerSelector,
            itemSelector,
            headers,
        );
    }

    async close() {
        return this._page.close();
    }
}

module.exports = PuppeteerPage;
