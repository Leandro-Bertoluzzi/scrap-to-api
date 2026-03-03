'use strict';

/** @type {Record<string, string>} */
const CATEGORY_CLASS_MAP = {
    tv: '.js-seasonal-anime-list-key-1',
    ova: '.js-seasonal-anime-list-key-2',
    movie: '.js-seasonal-anime-list-key-3',
    special: '.js-seasonal-anime-list-key-4',
    ona: '.js-seasonal-anime-list-key-5',
};

/**
 * Returns the seasonal anime listing URL.
 * When both year and season are provided the URL targets that specific season;
 * otherwise it targets the current season.
 *
 * @param {string} baseUrl
 * @param {string|null} year
 * @param {string|null} season - 'winter' | 'spring' | 'summer' | 'fall'
 * @returns {string}
 */
function buildSeasonalUrl(baseUrl, year, season) {
    return year && season
        ? `${baseUrl}/anime/season/${year}/${season}`
        : `${baseUrl}/anime/season`;
}

/**
 * Returns the CSS parent selector and card selector for the given category.
 *
 * @param {string|null} category - 'tv' | 'ova' | 'movie' | 'special' | 'ona' | null
 * @returns {{ parent: string, selector: string }}
 */
function buildSeasonalSelector(category) {
    const categoryFilter = CATEGORY_CLASS_MAP[category] ?? '';
    const parent = `div#content > div > div.seasonal-anime-list${categoryFilter}`;
    return { parent, selector: `${parent} div.seasonal-anime` };
}

module.exports = { buildSeasonalUrl, buildSeasonalSelector };
