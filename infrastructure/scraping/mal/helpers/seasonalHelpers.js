'use strict';

/** CSS selector for the seasonal anime list containers. */
const CONTAINER_SELECTOR = 'div#content > div > div.seasonal-anime-list';

/** CSS selector for the header element inside each list container. */
const HEADER_SELECTOR = 'div.anime-header';

/** CSS selector for the anime cards inside each list container. */
const ITEM_SELECTOR = 'div.seasonal-anime';

/**
 * Maps a category key to the header text(s) of the section(s) that belong to it.
 * `null` values indicate "return everything" (no header filtering).
 *
 * @type {Record<string, string[]>}
 */
const CATEGORY_HEADER_MAP = {
    tv: ['TV (New)', 'TV (Continuing)'],
    tv_new: ['TV (New)'],
    tv_continuing: ['TV (Continuing)'],
    ova: ['OVA'],
    movie: ['Movie'],
    special: ['Special'],
    ona: ['ONA'],
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
 * Returns the selectors and header filter needed to extract seasonal anime cards.
 *
 * @param {string|null} category
 *   One of 'tv' | 'tv_new' | 'tv_continuing' | 'ova' | 'movie' | 'special' | 'ona' | null
 * @returns {{
 *   containerSelector: string,
 *   headerSelector: string,
 *   itemSelector: string,
 *   headers: string[]|null
 * }}
 */
function buildSeasonalFilter(category) {
    const headers = (category && CATEGORY_HEADER_MAP[category]) ?? null;
    return { containerSelector: CONTAINER_SELECTOR, headerSelector: HEADER_SELECTOR, itemSelector: ITEM_SELECTOR, headers };
}

/**
 * Reverse lookup: maps an anime-header text to its normalized category key.
 *
 * @type {Record<string, string>}
 */
const HEADER_TO_CATEGORY_MAP = {
    'TV (New)': 'tv_new',
    'TV (Continuing)': 'tv_continuing',
    OVA: 'ova',
    Movie: 'movie',
    Special: 'special',
    ONA: 'ona',
};

module.exports = { buildSeasonalUrl, buildSeasonalFilter, HEADER_TO_CATEGORY_MAP };
