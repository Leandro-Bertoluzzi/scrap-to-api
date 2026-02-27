const puppeteer = require('puppeteer');

class Browser {
    browser = null;
    finalizer;

    constructor() {
        // Safety net: close the underlying browser if this instance is GC'd
        // without an explicit close() call.
        this.finalizer = new FinalizationRegistry(() => {
            this.browser?.close();
        });
        this.finalizer.register(this, undefined);
    }

    async start() {
        try {
            console.log('Opening the browser......');
            this.browser = await puppeteer.launch({
                headless: true,
                executablePath: '/usr/bin/google-chrome',	// Uncomment if using inside docker container
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

    /** The underlying Puppeteer Browser instance. */
    get instance() {
        return this.browser;
    }

    async close() {
        if (this.browser) {
            await this.browser.close();
            this.browser = null;
        }
    }
}

module.exports = Browser;
