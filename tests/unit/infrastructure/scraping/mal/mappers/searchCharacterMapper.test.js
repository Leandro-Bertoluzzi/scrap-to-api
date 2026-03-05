'use strict';

const { describe, it } = require('node:test');
const assert = require('node:assert/strict');
const searchCharacterMapper = require('../../../../../../infrastructure/scraping/mal/mappers/searchCharacterMapper');

describe('searchCharacterMapper', () => {
    // Character with alternate name, anime and manga appearances
    const GOKU_XENO_RAW =
        'Son, Gokuu: Xeno\n(Kakarot, Red Goku)\t' +
        'Anime: Super Dragon Ball Heroes\n' +
        'Manga: Super Dragon Ball Heroes: Ankoku Makai Mission!, Super Dragon Ball Heroes: Ultra God Mission!!!!';

    // Character with no alternate name and only manga appearances
    const PUNPUN_RAW =
        'Onodera, Punpun\n(Punyama, Ono-D, Takashi Fujikawa)\t\n' +
        'Manga: Oyasumi Punpun';

    // Character with no alternate name, no appearances
    const SIMPLE_RAW = 'Goku\t';

    describe('name', () => {
        it('extracts the name from the name block', () => {
            assert.equal(searchCharacterMapper(GOKU_XENO_RAW).name, 'Son, Gokuu: Xeno');
        });

        it('extracts a plain name with no alternate name', () => {
            assert.equal(searchCharacterMapper(SIMPLE_RAW).name, 'Goku');
        });

        it('trims whitespace from name', () => {
            const raw = '  Goku  \t';
            assert.equal(searchCharacterMapper(raw).name, 'Goku');
        });
    });

    describe('alternateName', () => {
        it('extracts alternate name from parentheses on the second line', () => {
            assert.equal(searchCharacterMapper(GOKU_XENO_RAW).alternateName, 'Kakarot, Red Goku');
        });

        it('extracts alternate name with multiple aliases', () => {
            assert.equal(searchCharacterMapper(PUNPUN_RAW).alternateName, 'Punyama, Ono-D, Takashi Fujikawa');
        });

        it('returns null when there is no second line', () => {
            assert.equal(searchCharacterMapper(SIMPLE_RAW).alternateName, null);
        });

        it('returns null when second line is not wrapped in parentheses', () => {
            const raw = 'Goku\nsome text\t';
            assert.equal(searchCharacterMapper(raw).alternateName, null);
        });
    });

    describe('anime', () => {
        it('extracts anime appearances as an array', () => {
            assert.deepEqual(searchCharacterMapper(GOKU_XENO_RAW).anime, ['Super Dragon Ball Heroes']);
        });

        it('extracts multiple anime titles', () => {
            const raw =
                'Gokua\n(Kogu)\t' +
                'Anime: Super Dragon Ball Heroes, Dragon Ball Z Movie 09: Ginga Girigiri!! Bucchigiri no Sugoi Yatsu\n' +
                'Manga: Super Dragon Ball Heroes: Ultra God Mission!!!!';
            assert.deepEqual(searchCharacterMapper(raw).anime, [
                'Super Dragon Ball Heroes',
                'Dragon Ball Z Movie 09: Ginga Girigiri!! Bucchigiri no Sugoi Yatsu',
            ]);
        });

        it('returns an empty array when there are no anime appearances', () => {
            assert.deepEqual(searchCharacterMapper(PUNPUN_RAW).anime, []);
        });

        it('returns an empty array when appearances block is absent', () => {
            assert.deepEqual(searchCharacterMapper(SIMPLE_RAW).anime, []);
        });
    });

    describe('manga', () => {
        it('extracts manga appearances as an array', () => {
            assert.deepEqual(searchCharacterMapper(PUNPUN_RAW).manga, ['Oyasumi Punpun']);
        });

        it('extracts multiple manga titles', () => {
            assert.deepEqual(searchCharacterMapper(GOKU_XENO_RAW).manga, [
                'Super Dragon Ball Heroes: Ankoku Makai Mission!',
                'Super Dragon Ball Heroes: Ultra God Mission!!!!',
            ]);
        });

        it('returns an empty array when there are no manga appearances', () => {
            const raw = 'Son-Goku\n(Alakazam)\tAnime: Saiyuuki';
            assert.deepEqual(searchCharacterMapper(raw).manga, []);
        });
    });

    describe('result shape', () => {
        it('returns an object with all expected keys', () => {
            const result = searchCharacterMapper(GOKU_XENO_RAW);
            assert.ok(Object.hasOwn(result, 'name'));
            assert.ok(Object.hasOwn(result, 'alternateName'));
            assert.ok(Object.hasOwn(result, 'anime'));
            assert.ok(Object.hasOwn(result, 'manga'));
        });
    });
});
