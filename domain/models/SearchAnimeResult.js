'use strict';

/**
 * Domain model: Search Anime Result
 *
 * @typedef {Object} SearchAnimeResult
 * @property {string} name
 * @property {string|null} description
 * @property {string|null} type
 * @property {number|null} episodes
 * @property {number|null} score
 */

/**
 * @param {{ name: string, description?: string|null, type?: string|null, episodes?: number|null, score?: number|null }} fields
 * @returns {SearchAnimeResult}
 */
function createSearchAnimeResult({ name, description = null, type = null, episodes = null, score = null }) {
    return { name, description, type, episodes, score };
}

module.exports = { createSearchAnimeResult };
