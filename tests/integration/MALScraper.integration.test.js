'use strict';

const { describe, it, before, after } = require('node:test');
const assert = require('node:assert/strict');

const MALScraper = require('../../infrastructure/scraping/MALScraper');
const PuppeteerBrowser = require('../../infrastructure/scraping/PuppeteerBrowser');
const createServer = require('../../infrastructure/http/server');
const SearchUseCase = require('../../application/use-cases/SearchUseCase');
const ListSeasonalAnimeUseCase = require('../../application/use-cases/ListSeasonalAnimeUseCase');
const { start: startStaticServer } = require('./helpers/StaticServer');

/** Starts the Express app on a random port. Returns { url, close }. */
function startApiServer(app) {
    return new Promise((resolve, reject) => {
        const server = app.listen(0, (err) => {
            if (err) return reject(err);
            const { port } = server.address();
            resolve({
                url: `http://localhost:${port}`,
                close: () => new Promise((res) => server.close(res)),
            });
        });
    });
}

describe('API (integration)', () => {
    let staticServer;
    let browser;
    let apiServer;

    before(async () => {
        // 1. Serve HTML fixtures locally
        staticServer = await startStaticServer();

        // 2. Real Puppeteer browser pointed at the fixture server
        browser = new PuppeteerBrowser();
        await browser.start();

        // 3. Wire the full dependency graph
        const scraper = new MALScraper(browser, { baseUrl: staticServer.url });
        const searchUseCase = new SearchUseCase(scraper);
        const listSeasonalAnimeUseCase = new ListSeasonalAnimeUseCase(scraper);
        const app = createServer(searchUseCase, listSeasonalAnimeUseCase);

        // 4. Start the Express API on a random port
        apiServer = await startApiServer(app);
    });

    after(async () => {
        await apiServer.close();
        await browser.close();
        await staticServer.close();
    });

    // -- GET /search/anime ---------------------------------------------------

    describe('GET /search/anime', () => {
        it('responds with 200 and a result array', async () => {
            const res = await fetch(`${apiServer.url}/search/anime?query=claymore&page=0`);
            assert.equal(res.status, 200);

            const body = await res.json();
            assert.ok(Array.isArray(body.result), 'body.result should be an array');
            assert.ok(body.result.length > 0, 'expected at least one result');
        });

        it('maps the first result correctly', async () => {
            const res = await fetch(`${apiServer.url}/search/anime?query=claymore&page=0`);
            const { result } = await res.json();
            const first = result[0];

            assert.equal(first.name, 'Claymore');
            assert.equal(first.type, 'TV');
            assert.equal(first.episodes, 26);
            assert.equal(first.score, 7.73);
        });
    });

    // -- GET /search/manga ---------------------------------------------------

    describe('GET /search/manga', () => {
        it('responds with 200 and a result array', async () => {
            const res = await fetch(`${apiServer.url}/search/manga?query=claymore&page=0`);
            assert.equal(res.status, 200);

            const body = await res.json();
            assert.ok(Array.isArray(body.result), 'body.result should be an array');
            assert.ok(body.result.length > 0, 'expected at least one result');
        });

        it('maps the first result correctly', async () => {
            const res = await fetch(`${apiServer.url}/search/manga?query=claymore&page=0`);
            const { result } = await res.json();
            const first = result[0];

            assert.equal(first.name, 'Claymore');
            assert.equal(first.type, 'Manga');
            assert.equal(first.episodes, 27); // volumes for manga
            assert.equal(first.score, 8.28);
        });
    });

    // -- GET /list/anime/season ----------------------------------------------

    describe('GET /list/anime/season (current -- Winter 2026)', () => {
        it('responds with 200 and a result array', async () => {
            const res = await fetch(`${apiServer.url}/list/anime/season?cat=tv`);
            assert.equal(res.status, 200);

            const body = await res.json();
            assert.ok(Array.isArray(body.result), 'body.result should be an array');
            assert.ok(body.result.length > 0, 'expected at least one result');
        });

        it('maps the first result correctly', async () => {
            const res = await fetch(`${apiServer.url}/list/anime/season?cat=tv`);
            const { result } = await res.json();
            const first = result[0];

            assert.equal(first.name, 'Sousou no Frieren 2nd Season');
            assert.equal(first.studio, 'Madhouse');
            assert.ok(
                typeof first.score === 'number' && first.score > 0,
                'score should be a positive number',
            );
        });

        it('maps result from another category correctly (movie)', async () => {
            const res = await fetch(`${apiServer.url}/list/anime/season?cat=movie`);
            const { result } = await res.json();
            const first = result[0];
            assert.equal(first.name, 'Tensei shitara Slime Datta Ken Movie 2: Soukai no Namida-hen');
            assert.equal(first.studio, '8bit');
            assert.ok(first.score === null); // Doesn't have a score yet
        });
    });

    describe('GET /list/anime/season (Spring 2024)', () => {
        it('responds with 200 and a result array', async () => {
            const res = await fetch(`${apiServer.url}/list/anime/season?year=2024&season=spring&cat=tv`);
            assert.equal(res.status, 200);

            const body = await res.json();
            assert.ok(Array.isArray(body.result), 'body.result should be an array');
            assert.ok(body.result.length > 0, 'expected at least one result');
        });

        it('maps the first result correctly', async () => {
            const res = await fetch(`${apiServer.url}/list/anime/season?year=2024&season=spring&cat=tv`);
            const { result } = await res.json();
            const first = result[0];

            assert.equal(first.name, 'Kimetsu no Yaiba: Hashira Geiko-hen');
            assert.equal(first.studio, 'ufotable');
            assert.ok(
                typeof first.score === 'number' && first.score > 0,
                'score should be a positive number',
            );
        });

        it('maps result from another category correctly (movie)', async () => {
            const res = await fetch(`${apiServer.url}/list/anime/season?year=2024&season=spring&cat=movie`);
            const { result } = await res.json();
            const first = result[0];

            assert.equal(first.name, 'Look Back');
            assert.equal(first.studio, 'Studio DURIAN');
            assert.equal(first.score, 8.62);
        });
    });

    // -- Error handling -------------------------------------------------------

    describe('error handling', () => {
        it('returns 404 when the scraper encounters a 404 page', async () => {
            const res = await fetch(`${apiServer.url}/nonexistent/path`);
            assert.equal(res.status, 404);

            const body = await res.json();
            assert.equal(body.error, 'Not found');
        });
    });
});
