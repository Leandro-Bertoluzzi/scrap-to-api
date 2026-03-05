'use strict';

const { createSearchPeopleResult } = require('../../../../domain/models/SearchPeopleResult');

/**
 * Maps a raw innerText string from a MAL people search result row into a SearchPeopleResult.
 *
 * Expected raw format:
 *   "Name[\n(Alternate Name)]"
 *
 * @param {string} raw
 * @returns {import('../../../../domain/models/SearchPeopleResult').SearchPeopleResult}
 */
function searchPeopleMapper(raw) {
    const lines = raw.split('\n');

    const name = lines[0]?.trim() || null;

    const alternateRaw = lines[1]?.trim() || '';
    const alternateMatch = alternateRaw.match(/^\((.+)\)$/);
    const alternateName = alternateMatch ? alternateMatch[1].trim() : null;

    return createSearchPeopleResult({ name, alternateName });
}

module.exports = searchPeopleMapper;
