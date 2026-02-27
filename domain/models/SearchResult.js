'use strict';

/**
 * Domain model: Search Result
 *
 * @typedef {Object} SearchResult
 * @property {string} name
 * @property {string|null} description
 * @property {string|null} type
 * @property {number|null} episodes
 * @property {number|null} score
 */

/**
 * @param {{ name: string, description?: string, type?: string, episodes?: number, score?: number }} fields
 * @returns {SearchResult}
 */
function createSearchResult({ name, description = null, type = null, episodes = null, score = null }) {
    return { name, description, type, episodes, score };
}

module.exports = { createSearchResult };
