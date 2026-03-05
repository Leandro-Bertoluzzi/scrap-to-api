'use strict';

/**
 * Domain model: Search Character Result
 *
 * @typedef {Object} SearchCharacterResult
 * @property {string} name
 * @property {string|null} alternateName
 * @property {string[]} anime
 * @property {string[]} manga
 */

/**
 * @param {{ name: string, alternateName?: string|null, anime?: string[], manga?: string[] }} fields
 * @returns {SearchCharacterResult}
 */
function createSearchCharacterResult({ name, alternateName = null, anime = [], manga = [] }) {
    return { name, alternateName, anime, manga };
}

module.exports = { createSearchCharacterResult };
