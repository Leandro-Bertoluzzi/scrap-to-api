'use strict';

const ISearchRepository = require('../../domain/ports/ISearchRepository');
const ISeasonalAnimeRepository = require('../../domain/ports/ISeasonalAnimeRepository');
const searchResultMapper = require('./mappers/searchResultMapper');
const seasonalAnimeMapper = require('./mappers/seasonalAnimeMapper');
const { buildSearchUrl, buildSearchSelector, hasSearchHeader } = require('./helpers/searchHelpers');
const { buildSeasonalUrl, buildSeasonalSelector } = require('./helpers/seasonalHelpers');

/**
 * Infrastructure adapter: MyAnimeList scraper.
 * Satisfies both ISearchRepository and ISeasonalAnimeRepository.
 * A single adapter is intentional: both ports share the same browser,
 * base URL and page-size configuration.
 *
 * @implements {ISearchRepository}
 * @implements {ISeasonalAnimeRepository}
 */
class MALScraper {
    /**
     * @param {import('../../domain/ports/IBrowser')} browser
     * @param {{ baseUrl?: string, pageSize?: number }} options
     */
    constructor(browser, options = {}) {
        this.browser = browser;
        this.baseUrl = options.baseUrl || 'https://myanimelist.net';
        this.pageSize = options.pageSize || 50;
    }

    async search(type, searchQuery, currentPage) {
        const page = await this.browser.newPage();
        const url = buildSearchUrl(this.baseUrl, type, searchQuery, currentPage, this.pageSize);
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
        return results.map(searchResultMapper);
    }

    async seasonalAnime(year = null, season = null, category = null) {
        const page = await this.browser.newPage();
        const url = buildSeasonalUrl(this.baseUrl, year, season);
        console.log(`Navigating to ${url}"...`);

        const statusCode = await page.goto(url);
        if (statusCode === 404) {
            console.error('404 status code found in result');
            throw new Error('404: Page not found');
        }

        const { parent, selector } = buildSeasonalSelector(category);
        await page.waitForSelector(parent);
        const rows = await page.extractText(selector);

        await page.close();

        return rows.map(seasonalAnimeMapper);
    }
}

module.exports = MALScraper;
