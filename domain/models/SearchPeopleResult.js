'use strict';

/**
 * Domain model: Search People Result
 *
 * @typedef {Object} SearchPeopleResult
 * @property {string} name
 * @property {string|null} alternateName
 */

/**
 * @param {{ name: string, alternateName?: string|null }} fields
 * @returns {SearchPeopleResult}
 */
function createSearchPeopleResult({ name, alternateName = null }) {
    return { name, alternateName };
}

module.exports = { createSearchPeopleResult };
