'use strict';

const { describe, it } = require('node:test');
const assert = require('node:assert/strict');
const searchMangaMapper = require('../../../../../infrastructure/scraping/mappers/searchMangaMapper');

describe('searchMangaMapper', () => {
    // Manga result with a bookstore "Read Manga" link (the common case on MAL)
    const CLAYMORE_RAW_WITH_BOOKSTORE =
        'Claymore add Read Manga\n' +
        'It is the Middle Ages, and the remnants of mankind are plagued by paranoia and death...read more.\n' +
        '\tManga\t27\t8.28';

    // Manga result without a bookstore link
    const CLAYMORE_RAW_NO_BOOKSTORE =
        'Claymore add\n' +
        'It is the Middle Ages, and the remnants of mankind are plagued by paranoia and death...read more.\n' +
        '\tManga\t27\t8.28';

    describe('name', () => {
        it('strips "add Read Manga" from the title (bookstore variant)', () => {
            assert.equal(searchMangaMapper(CLAYMORE_RAW_WITH_BOOKSTORE).name, 'Claymore');
        });

        it('strips "add" from the title (no bookstore variant)', () => {
            assert.equal(searchMangaMapper(CLAYMORE_RAW_NO_BOOKSTORE).name, 'Claymore');
        });

        it('trims whitespace from name', () => {
            const raw = '  Berserk  add\nDescription.\n\tManga\t-\t9.40';
            assert.equal(searchMangaMapper(raw).name, 'Berserk');
        });
    });

    describe('description', () => {
        it('extracts the description from the second line', () => {
            const result = searchMangaMapper(CLAYMORE_RAW_WITH_BOOKSTORE);
            assert.ok(result.description.startsWith('It is the Middle Ages'));
        });

        it('replaces "...read more." with an ellipsis', () => {
            const result = searchMangaMapper(CLAYMORE_RAW_WITH_BOOKSTORE);
            assert.ok(result.description.endsWith('...'));
            assert.ok(!result.description.includes('read more'));
        });

        it('keeps full description intact when not truncated', () => {
            const raw = 'Berserk add\nThis is the full description.\n\tManga\t40\t9.40';
            assert.equal(searchMangaMapper(raw).description, 'This is the full description.');
        });

        it('returns null when description line is empty', () => {
            const raw = 'Berserk add\n\n\tManga\t40\t9.40';
            assert.equal(searchMangaMapper(raw).description, null);
        });
    });

    describe('type', () => {
        it('extracts the type from the last tab-separated line', () => {
            assert.equal(searchMangaMapper(CLAYMORE_RAW_WITH_BOOKSTORE).type, 'Manga');
        });

        it('extracts One-shot type', () => {
            const raw = 'Some One-shot add\nDescription.\n\tOne-shot\t1\t6.70';
            assert.equal(searchMangaMapper(raw).type, 'One-shot');
        });

        it('returns null when type is absent', () => {
            const raw = 'Some Manga add\nDescription.\n';
            assert.equal(searchMangaMapper(raw).type, null);
        });
    });

    describe('episodes (volumes)', () => {
        it('extracts volume count as an integer', () => {
            assert.equal(searchMangaMapper(CLAYMORE_RAW_WITH_BOOKSTORE).episodes, 27);
        });

        it('returns null when volume count is a dash', () => {
            const raw = 'Some Manga add\nDescription.\n\tManga\t-\t8.00';
            assert.equal(searchMangaMapper(raw).episodes, null);
        });

        it('returns null when volume count is missing', () => {
            const raw = 'Some Manga add\nDescription.\n\tManga\t\t8.00';
            assert.equal(searchMangaMapper(raw).episodes, null);
        });
    });

    describe('score', () => {
        it('extracts the score as a float', () => {
            assert.equal(searchMangaMapper(CLAYMORE_RAW_WITH_BOOKSTORE).score, 8.28);
        });

        it('returns null when score is N/A', () => {
            const raw = 'Some Manga add\nDescription.\n\tManga\t5\tN/A';
            assert.equal(searchMangaMapper(raw).score, null);
        });
    });

    describe('result shape', () => {
        it('returns an object with all expected keys', () => {
            const result = searchMangaMapper(CLAYMORE_RAW_WITH_BOOKSTORE);
            assert.ok('name' in result);
            assert.ok('description' in result);
            assert.ok('type' in result);
            assert.ok('episodes' in result);
            assert.ok('score' in result);
        });
    });
});
