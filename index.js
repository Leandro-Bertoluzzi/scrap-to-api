'use strict';

// Infrastructure
const PuppeteerBrowser = require('./infrastructure/scraping/PuppeteerBrowser');
const MALScraper = require('./infrastructure/scraping/MALScraper');
const createServer = require('./infrastructure/http/server');

// Application
const SearchUseCase = require('./application/use-cases/SearchUseCase');
const ListSeasonalAnimeUseCase = require('./application/use-cases/ListSeasonalAnimeUseCase');

// Config
const config = require('./config/config');
const API_PORT = config.API_PORT;
const API_HOST = config.API_HOST;

// Composition root
async function main() {
    // 1. Infrastructure: spin up the browser once (singleton for the app lifetime)
    const browser = new PuppeteerBrowser();
    await browser.start();

    // 2. Infrastructure: scraper adapter wired to the browser
    const scraperRepository = new MALScraper(browser, {
        baseUrl: config.MAL_BASE_URL,
    });

    // 3. Application: use cases wired to the repository port
    const searchUseCase = new SearchUseCase(scraperRepository);
    const listSeasonalAnimeUseCase = new ListSeasonalAnimeUseCase(scraperRepository);

    // 4. Infrastructure: HTTP server wired to the use cases
    const app = createServer(searchUseCase, listSeasonalAnimeUseCase);

    // 5. Start listening
    const server = app.listen(API_PORT, API_HOST, function () {
        console.log(`Server running on http://${API_HOST}:${API_PORT}`);
    });

    // 6. Graceful shutdown: close browser when the process terminates
    async function shutdown(signal) {
        console.log(`\n${signal} received. Shutting down gracefully...`);
        server.close(async () => {
            await browser.close();
            console.log('Browser closed. Exiting.');
            process.exit(0);
        });
    }

    process.on('SIGTERM', () => shutdown('SIGTERM'));
    process.on('SIGINT', () => shutdown('SIGINT'));
}

main().catch((err) => {
    console.error('Fatal error during startup:', err);
    process.exit(1);
});
