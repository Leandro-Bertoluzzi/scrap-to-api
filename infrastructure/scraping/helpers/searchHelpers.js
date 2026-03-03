'use strict';

/**
 * Returns the paginated search URL for the given type and query.
 *
 * @param {string} baseUrl
 * @param {string} type - e.g. 'anime', 'manga', 'character', 'people'
 * @param {string} query
 * @param {number} currentPage - zero-based page index
 * @param {number} pageSize - number of results per page
 * @returns {string}
 */
function buildSearchUrl(baseUrl, type, query, currentPage, pageSize) {
    const offset = currentPage * pageSize;
    return `${baseUrl}/${type}.php?q=${query}&show=${offset}`;
}

/**
 * Returns the CSS parent selector and row selector for the given search type.
 *
 * @param {string} type - e.g. 'anime', 'manga', 'character', 'people'
 * @returns {{ parent: string, selector: string }}
 */
function buildSearchSelector(type) {
    const parent =
        type === 'anime' || type === 'manga'
            ? 'div#content > div > table'
            : 'div#content > table';
    return { parent, selector: `${parent} tr` };
}

/**
 * Returns whether the search results table for the given type has a header row
 * that must be stripped before mapping.
 *
 * @param {string} type
 * @returns {boolean}
 */
function hasSearchHeader(type) {
    return type === 'anime' || type === 'manga';
}

module.exports = { buildSearchUrl, buildSearchSelector, hasSearchHeader };
