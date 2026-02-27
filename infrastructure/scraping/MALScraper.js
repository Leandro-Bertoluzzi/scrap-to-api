'use strict';

const IScraperRepository = require('../../domain/ports/IScraperRepository');

/**
 * Infrastructure adapter: MyAnimeList scraper implementation of IScraperRepository.
 * Depends on IBrowser (injected via constructor).
 */
class MALScraper extends IScraperRepository {
    /**
     * @param {import('../../domain/ports/IBrowser')} browser
     * @param {{ baseUrl?: string, pageSize?: number }} options
     */
    constructor(browser, options = {}) {
        super();
        this.browser = browser;
        this.baseUrl = options.baseUrl || 'https://myanimelist.net';
        this.pageSize = options.pageSize || 50;
    }

    async search(type, searchQuery, currentPage) {
        const page = await this.browser.newPage();
        const offset = currentPage * this.pageSize;
        const url = `${this.baseUrl}/${type}.php?q=${searchQuery}&show=${offset}`;
        console.log(`Navigating to ${url}"...`);
        const gotoResult = await page.goto(url);
        if (gotoResult.status() === 404) {
            console.error('404 status code found in result');
            throw new Error('404: Page not found');
        }

        // Wait for the required DOM to be rendered
        const parent =
            type === 'anime' || type === 'manga'
                ? 'div#content > div > table'
                : 'div#content > table';
        await page.waitForSelector(parent);

        // Get the details of each entry
        const selector = `${parent} tr`;
        const result = await page.$$eval(selector, (text) => {
            text = text.map((el) => el.innerText.trim());
            return text;
        });

        await page.close();

        // Remove table headers (first element in array)
        if (type === 'anime' || type === 'manga') {
            result.shift();
        }
        return result;
    }

    async seasonalAnime(year = null, season = null, category = null) {
        const page = await this.browser.newPage();
        const url =
            year && season
                ? `${this.baseUrl}/anime/season/${year}/${season}`
                : `${this.baseUrl}/anime/season`;
        console.log(`Navigating to ${url}"...`);
        const gotoResult = await page.goto(url);
        if (gotoResult.status() === 404) {
            console.error('404 status code found in result');
            throw new Error('404: Page not found');
        }

        const categoryToClassMapping = {
            tv: '.js-seasonal-anime-list-key-1',
            ova: '.js-seasonal-anime-list-key-2',
            movie: '.js-seasonal-anime-list-key-3',
            special: '.js-seasonal-anime-list-key-4',
            ona: '.js-seasonal-anime-list-key-5',
        };
        const categoryFilter = categoryToClassMapping[category] ?? '';

        // Search for elements, filtering by category
        const parent = `div#content > div > div.seasonal-anime-list${categoryFilter}`;
        await page.waitForSelector(parent);
        const selector = `${parent} div.seasonal-anime`;
        const result = await page.$$eval(selector, (text) => {
            text = text.map((el) => el.innerText.trim());
            return text;
        });

        await page.close();
        return result;
    }
}

module.exports = MALScraper;
