'use strict';

const VALID_SEASONS = ['summer', 'fall', 'winter', 'spring'];
const VALID_CATEGORIES = ['tv', 'tv_new', 'tv_continuing', 'ova', 'movie', 'special', 'ona'];
const MIN_YEAR = 1900;

/**
 * Validates the parameters for the list seasonal anime endpoint.
 *
 * @param {string|null} year - Optional. If present, must be an integer between 1900 and the current year inclusive.
 * @param {string|null} season - Optional. If present, must be one of 'summer' | 'fall' | 'winter' | 'spring'.
 * @param {string|null} category - Optional. If present, must be one of 'tv' | 'tv_new' | 'tv_continuing' | 'ova' | 'movie' | 'special' | 'ona'.
 * @returns {{ field: string, message: string }[]} Array of validation errors — empty if all params are valid.
 */
function validateListSeasonalParams(year, season, category) {
    const errors = [];
    const currentYear = new Date().getFullYear();

    if (year !== undefined && year !== null) {
        const num = Number(year);
        if (!Number.isInteger(num) || num < MIN_YEAR || num > currentYear) {
            errors.push({
                field: 'year',
                message: `Invalid 'year' parameter. Must be an integer between ${MIN_YEAR} and ${currentYear}.`,
            });
        }
    }

    if (season !== undefined && season !== null) {
        if (!VALID_SEASONS.includes(season)) {
            errors.push({
                field: 'season',
                message: `Invalid 'season' parameter. Must be one of: ${VALID_SEASONS.join(', ')}.`,
            });
        }
    }

    if (category !== undefined && category !== null) {
        if (!VALID_CATEGORIES.includes(category)) {
            errors.push({
                field: 'cat',
                message: `Invalid 'cat' parameter. Must be one of: ${VALID_CATEGORIES.join(', ')}.`,
            });
        }
    }

    return errors;
}

module.exports = { validateListSeasonalParams };
