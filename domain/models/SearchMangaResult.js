'use strict';

/**
 * Domain model: Search Manga Result
 *
 * @typedef {Object} SearchMangaResult
 * @property {string} name
 * @property {string|null} description
 * @property {string|null} type
 * @property {number|null} volumes
 * @property {number|null} score
 */

/**
 * @param {{ name: string, description?: string|null, type?: string|null, volumes?: number|null, score?: number|null }} fields
 * @returns {SearchMangaResult}
 */
function createSearchMangaResult({ name, description = null, type = null, volumes = null, score = null }) {
    return { name, description, type, volumes, score };
}

module.exports = { createSearchMangaResult };
