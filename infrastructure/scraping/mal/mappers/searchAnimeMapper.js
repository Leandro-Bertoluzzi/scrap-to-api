'use strict';

const { createSearchAnimeResult } = require('../../../../domain/models/SearchAnimeResult');

/**
 * Maps a raw innerText string from a MAL anime search result row into a SearchAnimeResult.
 *
 * Expected raw format:
 *   "Name\nadd\nDescription...read more.\n\tType\tEpisodes\tScore"
 *
 * @param {string} raw
 * @returns {import('../../../../domain/models/SearchAnimeResult').SearchAnimeResult}
 */
function searchAnimeMapper(raw) {
    const lines = raw.split('\n');

    const name = lines[0]?.trim() || null;

    // Line 2: description — replace "...read more." suffix with an ellipsis
    const rawDescription = lines[2]?.trim() || '';
    const description = rawDescription.replace(/\.\.\.read more\..*/i, '...').trim() || null;

    // Last line: tab-separated metadata → ["", type, episodes, score]
    const metaLine = lines[lines.length - 1] ?? '';
    const meta = metaLine.split('\t');
    const type = meta[1]?.trim() || null;
    const episodesRaw = parseInt(meta[2], 10);
    const episodes = isNaN(episodesRaw) ? null : episodesRaw;
    const scoreRaw = parseFloat(meta[3]);
    const score = isNaN(scoreRaw) ? null : scoreRaw;

    return createSearchAnimeResult({ name, description, type, episodes, score });
}

module.exports = searchAnimeMapper;
