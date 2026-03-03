'use strict';

const puppeteer = require('puppeteer');
const IBrowser = require('../../domain/ports/IBrowser');
const PuppeteerPage = require('./PuppeteerPage');

/**
 * Infrastructure adapter: Puppeteer implementation of IBrowser.
 */
class PuppeteerBrowser extends IBrowser {
    #browser = null;
    #finalizer;

    constructor() {
        super();
        // Safety net: close the underlying browser if this instance is GC'd
        // without an explicit close() call.
        this.#finalizer = new FinalizationRegistry(() => {
            this.#browser?.close();
        });
        this.#finalizer.register(this, undefined);
    }

    async start() {
        try {
            console.log('Opening the browser......');
            this.#browser = await puppeteer.launch({
                headless: true,
                executablePath: '/usr/bin/google-chrome', // Uncomment if using inside docker container
                args: [
                    '--disable-gpu',
                    '--disable-dev-shm-usage',
                    '--disable-setuid-sandbox',
                    '--no-sandbox',
                ],
                ignoreHTTPSErrors: true,
            });
        } catch (err) {
            console.log('Could not create a browser instance => : ', err);
            throw err;
        }
        return this;
    }

    async newPage() {
        const rawPage = await this.#browser.newPage();
        return new PuppeteerPage(rawPage);
    }

    async close() {
        if (this.#browser) {
            await this.#browser.close();
            this.#browser = null;
        }
    }
}

module.exports = PuppeteerBrowser;
