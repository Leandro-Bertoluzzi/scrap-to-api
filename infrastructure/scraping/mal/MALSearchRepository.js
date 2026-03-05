'use strict';

const ISearchRepository = require('../../../domain/ports/ISearchRepository');
const searchAnimeMapper = require('./mappers/searchAnimeMapper');
const searchMangaMapper = require('./mappers/searchMangaMapper');
const searchCharacterMapper = require('./mappers/searchCharacterMapper');
const searchPeopleMapper = require('./mappers/searchPeopleMapper');
const { buildSearchUrl, buildSearchSelector, hasSearchHeader } = require('./helpers/searchHelpers');

/** @type {Record<string, (raw: string) => object>} */
const SEARCH_MAPPERS = {
    anime: searchAnimeMapper,
    manga: searchMangaMapper,
    character: searchCharacterMapper,
    people: searchPeopleMapper,
};

const defaultMapper = (raw) => ({ raw });

/**
 * Infrastructure adapter: MAL implementation of ISearchRepository.
 * Scrapes MyAnimeList search results using a browser instance.
 *
 * @implements {ISearchRepository}
 */
class MALSearchRepository extends ISearchRepository {
    /**
     * @param {import('../../../domain/ports/IBrowser')} browser
     * @param {{ baseUrl?: string }} options
     */
    constructor(browser, options = {}) {
        super();
        this.browser = browser;
        this.baseUrl = options.baseUrl || 'https://myanimelist.net';
    }

    async search(type, searchQuery, currentPage) {
        const page = await this.browser.newPage();
        const url = buildSearchUrl(this.baseUrl, type, searchQuery, currentPage);
        console.log(`Navigating to ${url}"...`);

        const statusCode = await page.goto(url);
        if (statusCode === 404) {
            console.error('404 status code found in result');
            throw new Error('404: Page not found');
        }

        const { parent, selector } = buildSearchSelector(type);
        await page.waitForSelector(parent);
        const rows = await page.extractText(selector);

        await page.close();

        const results = hasSearchHeader(type) ? rows.slice(1) : rows;
        const mapper = SEARCH_MAPPERS[type] ?? defaultMapper;
        return results.map(mapper);
    }
}

module.exports = MALSearchRepository;
