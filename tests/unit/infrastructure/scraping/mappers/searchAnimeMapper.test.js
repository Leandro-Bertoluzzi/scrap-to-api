'use strict';

const { describe, it } = require('node:test');
const assert = require('node:assert/strict');
const searchAnimeMapper = require('../../../../../infrastructure/scraping/mappers/searchAnimeMapper');

describe('searchAnimeMapper', () => {
    const CLAYMORE_RAW =
        'Claymore\nadd\n' +
        'When a shapeshifting demon with a thirst for human flesh, known as "youma," arrives ' +
        "in Raki's village, a lone woman with silver eyes walks into town with only a sword upon " +
        'her back. She is a "Claymore...read more.\n\tTV\t26\t7.73';

    describe('name', () => {
        it('extracts the name from the first line', () => {
            const result = searchAnimeMapper(CLAYMORE_RAW);
            assert.equal(result.name, 'Claymore');
        });

        it('trims whitespace from name', () => {
            const raw = '  Trigun  \nadd\nDescription.\n\tTV\t26\t8.23';
            assert.equal(searchAnimeMapper(raw).name, 'Trigun');
        });
    });

    describe('description', () => {
        it('extracts the description from the third line', () => {
            const result = searchAnimeMapper(CLAYMORE_RAW);
            assert.ok(result.description.startsWith('When a shapeshifting demon'));
        });

        it('replaces "...read more." with an ellipsis', () => {
            const result = searchAnimeMapper(CLAYMORE_RAW);
            assert.ok(result.description.endsWith('...'));
            assert.ok(!result.description.includes('read more'));
        });

        it('keeps full description intact when not truncated', () => {
            const raw = 'Some Anime\nadd\nThis is the full description.\n\tTV\t12\t8.00';
            assert.equal(searchAnimeMapper(raw).description, 'This is the full description.');
        });

        it('returns null when description line is empty', () => {
            const raw = 'Some Anime\nadd\n\n\tTV\t12\t8.00';
            assert.equal(searchAnimeMapper(raw).description, null);
        });
    });

    describe('type', () => {
        it('extracts the type from the last tab-separated line', () => {
            assert.equal(searchAnimeMapper(CLAYMORE_RAW).type, 'TV');
        });

        it('extracts OVA type', () => {
            const raw = 'Some OVA\nadd\nDescription.\n\tOVA\t1\t7.50';
            assert.equal(searchAnimeMapper(raw).type, 'OVA');
        });

        it('returns null when type is absent', () => {
            const raw = 'Some Anime\nadd\nDescription.\n';
            assert.equal(searchAnimeMapper(raw).type, null);
        });
    });

    describe('episodes', () => {
        it('extracts episode count as an integer', () => {
            assert.equal(searchAnimeMapper(CLAYMORE_RAW).episodes, 26);
        });

        it('returns null when episode count is not a number', () => {
            const raw = 'Some Anime\nadd\nDescription.\n\tTV\t-\t8.00';
            assert.equal(searchAnimeMapper(raw).episodes, null);
        });

        it('returns null when episode count is missing', () => {
            const raw = 'Some Anime\nadd\nDescription.\n\tTV\t\t8.00';
            assert.equal(searchAnimeMapper(raw).episodes, null);
        });
    });

    describe('score', () => {
        it('extracts the score as a float', () => {
            assert.equal(searchAnimeMapper(CLAYMORE_RAW).score, 7.73);
        });

        it('returns null when score is N/A', () => {
            const raw = 'Some Anime\nadd\nDescription.\n\tTV\t12\tN/A';
            assert.equal(searchAnimeMapper(raw).score, null);
        });

        it('returns null when score is missing', () => {
            const raw = 'Some Anime\nadd\nDescription.\n\tTV\t12\t';
            assert.equal(searchAnimeMapper(raw).score, null);
        });
    });

    describe('result shape', () => {
        it('returns an object with all expected keys', () => {
            const result = searchAnimeMapper(CLAYMORE_RAW);
            assert.ok(Object.hasOwn(result, 'name'));
            assert.ok(Object.hasOwn(result, 'description'));
            assert.ok(Object.hasOwn(result, 'type'));
            assert.ok(Object.hasOwn(result, 'episodes'));
            assert.ok(Object.hasOwn(result, 'score'));
        });
    });
});
