'use strict';

const { describe, it, before, after } = require('node:test');
const assert = require('node:assert/strict');

const MALSearchRepository = require('../../infrastructure/scraping/mal/MALSearchRepository');
const MALSeasonalRepository = require('../../infrastructure/scraping/mal/MALSeasonalRepository');
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
        const searchRepo = new MALSearchRepository(browser, { baseUrl: staticServer.url });
        const seasonalRepo = new MALSeasonalRepository(browser, { baseUrl: staticServer.url });
        const searchUseCase = new SearchUseCase(searchRepo);
        const listSeasonalAnimeUseCase = new ListSeasonalAnimeUseCase(seasonalRepo);
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
            assert.equal(first.volumes, 27);
            assert.equal(first.score, 8.28);
        });
    });

    // -- GET /list/anime/season ----------------------------------------------

    describe('GET /list/anime/season (current -- Winter 2026)', () => {
        it('responds with 200 and a result array', async () => {
            const res = await fetch(`${apiServer.url}/list/anime/season`);
            assert.equal(res.status, 200);

            const body = await res.json();
            assert.ok(Array.isArray(body.result), 'body.result should be an array');
            assert.ok(body.result.length > 0, 'expected at least one result');
        });

        it('gets result with no category correctly', async () => {
            const res = await fetch(`${apiServer.url}/list/anime/season`);
            const { result } = await res.json();

            // Validate results count
            assert.equal(result.length, 18, 'expected 18 anime in the fixture');

            // Validate first result
            const first = result[0];

            assert.equal(first.name, 'Sousou no Frieren 2nd Season');
            assert.equal(first.studio, 'Madhouse');
            assert.equal(first.category, 'tv_new');
            assert.ok(
                typeof first.score === 'number' && first.score > 0,
                'score should be a positive number',
            );
        });

        it('gets results from another category correctly (movie)', async () => {
            const res = await fetch(`${apiServer.url}/list/anime/season?cat=movie`);
            const { result } = await res.json();

            // Validate results count
            assert.equal(result.length, 3, 'expected 3 movie anime in the fixture');

            // Validate first result
            const first = result[0];
            assert.equal(first.name, 'Tensei shitara Slime Datta Ken Movie 2: Soukai no Namida-hen');
            assert.equal(first.studio, '8bit');
            assert.equal(first.category, 'movie');
            assert.ok(first.score === null); // Doesn't have a score yet
        });

        it('gets result with "combined" category (tv)', async () => {
            const res = await fetch(`${apiServer.url}/list/anime/season?cat=tv`);
            const { result } = await res.json();

            // Validate results count
            assert.equal(result.length, 6, 'expected 6 TV anime in the fixture');

            // Validate first result
            const first = result[0];
            assert.equal(first.name, 'Sousou no Frieren 2nd Season');
            assert.equal(first.studio, 'Madhouse');
            assert.equal(first.category, 'tv_new');
            assert.ok(
                typeof first.score === 'number' && first.score > 0,
                'score should be a positive number',
            );
        });
    });

    describe('GET /list/anime/season (Spring 2024)', () => {
        it('responds with 200 and a result array', async () => {
            const res = await fetch(`${apiServer.url}/list/anime/season?year=2024&season=spring`);
            assert.equal(res.status, 200);

            const body = await res.json();
            assert.ok(Array.isArray(body.result), 'body.result should be an array');
            assert.ok(body.result.length > 0, 'expected at least one result');
        });

        it('gets result with no category correctly', async () => {
            const res = await fetch(`${apiServer.url}/list/anime/season?year=2024&season=spring`);
            const { result } = await res.json();

            // Validate results count
            assert.equal(result.length, 18, 'expected 18 anime in the fixture');

            // Validate first result
            const first = result[0];
            assert.equal(first.name, 'Kimetsu no Yaiba: Hashira Geiko-hen');
            assert.equal(first.studio, 'ufotable');
            assert.equal(first.category, 'tv_new');
            assert.ok(
                typeof first.score === 'number' && first.score > 0,
                'score should be a positive number',
            );
        });

        it('gets result from another category correctly (movie)', async () => {
            const res = await fetch(`${apiServer.url}/list/anime/season?year=2024&season=spring&cat=movie`);
            const { result } = await res.json();

            // Validate results count
            assert.equal(result.length, 3, 'expected 3 movie anime in the fixture');

            // Validate first result
            const first = result[0];
            assert.equal(first.name, 'Look Back');
            assert.equal(first.studio, 'Studio DURIAN');
            assert.equal(first.category, 'movie');
            assert.equal(first.score, 8.62);
        });

        it('gets result with "combined" category (tv)', async () => {
            const res = await fetch(`${apiServer.url}/list/anime/season?year=2024&season=spring&cat=tv`);
            const { result } = await res.json();

            // Validate results count
            assert.equal(result.length, 6, 'expected 6 TV anime in the fixture');

            // Validate first result
            const first = result[0];
            assert.equal(first.name, 'Kimetsu no Yaiba: Hashira Geiko-hen');
            assert.equal(first.studio, 'ufotable');
            assert.ok(
                typeof first.score === 'number' && first.score > 0,
                'score should be a positive number',
            );
        });
    });

    describe('GET /list/anime/season (404 handling)', () => {
        it('responds with 400 when scraper throws a 404 error', async () => {
            const res = await fetch(`${apiServer.url}/list/anime/season?year=2020&season=summer`);
            assert.equal(res.status, 400);

            const body = await res.json();
            assert.equal(body.error, '404: Page not found');
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
