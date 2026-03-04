'use strict';

/**
 * Domain model: Seasonal Anime
 *
 * @typedef {Object} SeasonalAnime
 * @property {string} name
 * @property {string|null} category - 'tv_new' | 'tv_continuing' | 'ova' | 'movie' | 'special' | 'ona' | null
 * @property {string|null} description
 * @property {string|null} startDate
 * @property {number|null} episodes
 * @property {string|null} studio
 * @property {string|null} source
 * @property {string|null} demographics
 * @property {number|null} score
 */

/**
 * @param {{
 *   name: string,
 *   category?: string|null,
 *   description?: string,
 *   startDate?: string,
 *   episodes?: number,
 *   studio?: string,
 *   source?: string,
 *   demographics?: string,
 *   score?: number
 * }} fields
 * @returns {SeasonalAnime}
 */
function createSeasonalAnime({
    name,
    category = null,
    description = null,
    startDate = null,
    episodes = null,
    studio = null,
    source = null,
    demographics = null,
    score = null,
}) {
    return { name, category, description, startDate, episodes, studio, source, demographics, score };
}

module.exports = { createSeasonalAnime };
