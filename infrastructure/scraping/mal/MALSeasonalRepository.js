'use strict';

const ISeasonalAnimeRepository = require('../../../domain/ports/ISeasonalAnimeRepository');
const seasonalAnimeMapper = require('./mappers/seasonalAnimeMapper');
const { buildSeasonalUrl, buildSeasonalFilter, HEADER_TO_CATEGORY_MAP } = require('./helpers/seasonalHelpers');

/**
 * Infrastructure adapter: MAL implementation of ISeasonalAnimeRepository.
 * Scrapes MyAnimeList seasonal anime listings using a browser instance.
 *
 * @implements {ISeasonalAnimeRepository}
 */
class MALSeasonalRepository extends ISeasonalAnimeRepository {
    /**
     * @param {import('../../../domain/ports/IBrowser')} browser
     * @param {{ baseUrl?: string }} options
     */
    constructor(browser, options = {}) {
        super();
        this.browser = browser;
        this.baseUrl = options.baseUrl || 'https://myanimelist.net';
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

        const { containerSelector, headerSelector, itemSelector, headers } = buildSeasonalFilter(category);
        await page.waitForSelector(containerSelector);
        const rows = await page.evaluate(
            containerSelector,
            (containers, headerSel, itemSel, allowedHeaders) => {
                const allowed = allowedHeaders ? new Set(allowedHeaders) : null;
                return containers
                    .filter((container) => {
                        if (!allowed) return true;
                        const header = container.querySelector(headerSel);
                        return header && allowed.has(header.innerText.trim());
                    })
                    .flatMap((container) => {
                        const headerEl = container.querySelector(headerSel);
                        const headerText = headerEl ? headerEl.innerText.trim() : '';
                        return Array.from(container.querySelectorAll(itemSel)).map((el) => ({
                            text: el.innerText.trim(),
                            header: headerText,
                        }));
                    });
            },
            headerSelector,
            itemSelector,
            headers,
        );

        await page.close();

        return rows.map(({ text, header }) => seasonalAnimeMapper(text, HEADER_TO_CATEGORY_MAP[header] ?? null));
    }
}

module.exports = MALSeasonalRepository;
