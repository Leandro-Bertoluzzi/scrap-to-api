'use strict';

const { createSearchMangaResult } = require('../../../../domain/models/SearchMangaResult');

/**
 * Maps a raw innerText string from a MAL manga search result row into a SearchMangaResult.
 *
 * The manga search td does not wrap content in a `div.title` block, so buttons
 * ("add", "Read Manga") are concatenated inline with the title on the first line.
 *
 * Expected raw format:
 *   "Name add [Read Manga]\nDescription...read more.\n\tType\tVolumes\tScore"
 *
 * @param {string} raw
 * @returns {import('../../../../domain/models/SearchMangaResult').SearchMangaResult}
 */
function searchMangaMapper(raw) {
    const lines = raw.split('\n');

    // Strip the inline "add" button text and any trailing bookstore link text (e.g. "Read Manga")
    const name = lines[0].replace(/\s+add\b.*$/i, '').trim() || null;

    // Description is on line 1 for manga (no separate "add" line unlike anime)
    const rawDescription = lines[1]?.trim() || '';
    const description = rawDescription.replace(/\.\.\.read more\..*/i, '...').trim() || null;

    // Last line: tab-separated metadata → ["", type, volumes, score]
    const metaLine = lines[lines.length - 1] ?? '';
    const meta = metaLine.split('\t');
    const type = meta[1]?.trim() || null;
    const volumesRaw = parseInt(meta[2], 10);
    const volumes = isNaN(volumesRaw) ? null : volumesRaw;
    const scoreRaw = parseFloat(meta[3]);
    const score = isNaN(scoreRaw) ? null : scoreRaw;

    return createSearchMangaResult({ name, description, type, volumes, score });
}

module.exports = searchMangaMapper;
