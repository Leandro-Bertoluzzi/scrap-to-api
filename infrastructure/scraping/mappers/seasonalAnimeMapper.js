'use strict';

const { createSeasonalAnime } = require('../../../domain/models/SeasonalAnime');

/**
 * Maps a raw innerText string from a MAL seasonal anime card into a SeasonalAnime.
 *
 * Expected raw format (lines separated by \n):
 *   [0]  Name
 *   [1]  Alternative title (discard)
 *   [2]  "Jan 16, 2026 10 eps, 24 min"
 *   [3]  Genres concatenated (discard)
 *   [4]  Name duplicate (discard)
 *   [5+] Description paragraphs until "[Written by MAL Rewrite]"
 *        Then blank line, then:
 *        "StudioXxx" / "SourceXxx" / "DemographicXxx" / score / member count / "Add to My List"
 *
 * @param {string} raw
 * @returns {import('../../../domain/models/SeasonalAnime').SeasonalAnime}
 */
function seasonalAnimeMapper(raw) {
    const lines = raw.split('\n').map((l) => l.trim());

    const name = lines[0] || null;

    // Line 2: "Jan 16, 2026 10 eps, 24 min"
    const dateLine = lines[2] ?? '';
    const dateMatch = dateLine.match(/^([A-Za-z]+ \d+, \d{4})/);
    const startDate = dateMatch ? dateMatch[1] : null;
    const epsMatch = dateLine.match(/(\d+)\s*eps/);
    const episodes = epsMatch ? parseInt(epsMatch[1], 10) : null;

    // Description: lines from index 5 until (exclusive) "[Written by MAL Rewrite]" or a metadata line
    const metaPrefixes = ['Studio', 'Source', 'Demographic'];
    const isMetaLine = (l) =>
        metaPrefixes.some((p) => l.startsWith(p)) ||
        /^\d+\.\d+$/.test(l) ||
        /^\d+K?M?$/.test(l) ||
        l === 'Add to My List';

    const descLines = [];
    for (let i = 5; i < lines.length; i++) {
        const line = lines[i];
        if (line === '[Written by MAL Rewrite]' || isMetaLine(line)) {
            break;
        }
        if (line) {
            descLines.push(line);
        }
    }
    const description = descLines.length > 0 ? descLines.join(' ') : null;

    // Metadata lines after description block
    const studioLine = lines.find((l) => l.startsWith('Studio'));
    const studio = studioLine ? studioLine.replace('Studio', '').trim() || null : null;

    const sourceLine = lines.find((l) => l.startsWith('Source'));
    const source = sourceLine ? sourceLine.replace('Source', '').trim() || null : null;

    const demographicLine = lines.find((l) => l.startsWith('Demographic'));
    const demographics = demographicLine
        ? demographicLine.replace('Demographic', '').trim() || null
        : null;

    const scoreLine = lines.find((l) => /^\d+\.\d+$/.test(l));
    const score = scoreLine ? parseFloat(scoreLine) : null;

    return createSeasonalAnime({ name, description, startDate, episodes, studio, source, demographics, score });
}

module.exports = seasonalAnimeMapper;
