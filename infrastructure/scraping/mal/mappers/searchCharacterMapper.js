'use strict';

const { createSearchCharacterResult } = require('../../../../domain/models/SearchCharacterResult');

/**
 * Maps a raw innerText string from a MAL character search result row into a SearchCharacterResult.
 *
 * Expected raw format:
 *   "Name[\n(Alternate Name)]\t[\n][Anime: title1, title2]\n[Manga: title1, title2]"
 *
 * The name block and appearances block are separated by a tab character.
 * The appearances block contains optional lines prefixed with "Anime: " or "Manga: ".
 *
 * @param {string} raw
 * @returns {import('../../../../domain/models/SearchCharacterResult').SearchCharacterResult}
 */
function searchCharacterMapper(raw) {
    const [nameBlock = '', appearancesBlock = ''] = raw.split('\t');

    // Name block: first line is the name, optional second line is alternate name in parens
    const nameLines = nameBlock.split('\n');
    const name = nameLines[0]?.trim() || null;
    const alternateRaw = nameLines[1]?.trim() || '';
    const alternateMatch = alternateRaw.match(/^\((.+)\)$/);
    const alternateName = alternateMatch ? alternateMatch[1].trim() : null;

    // Appearances block: lines prefixed with "Anime: " or "Manga: "
    const appearanceLines = appearancesBlock.split('\n');

    const animeLine = appearanceLines.find((l) => l.startsWith('Anime: '));
    const anime = animeLine ? animeLine.slice('Anime: '.length).split(', ').map((s) => s.trim()).filter(Boolean) : [];

    const mangaLine = appearanceLines.find((l) => l.startsWith('Manga: '));
    const manga = mangaLine ? mangaLine.slice('Manga: '.length).split(', ').map((s) => s.trim()).filter(Boolean) : [];

    return createSearchCharacterResult({ name, alternateName, anime, manga });
}

module.exports = searchCharacterMapper;
