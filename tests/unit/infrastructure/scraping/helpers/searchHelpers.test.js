'use strict';

const { describe, it } = require('node:test');
const assert = require('node:assert/strict');
const {
    buildSearchUrl,
    buildSearchSelector,
    hasSearchHeader,
} = require('../../../../../infrastructure/scraping/helpers/searchHelpers');

describe('buildSearchUrl', () => {
    it('builds the correct URL for anime at page 0', () => {
        const url = buildSearchUrl('https://myanimelist.net', 'anime', 'claymore', 0);
        assert.equal(url, 'https://myanimelist.net/anime.php?q=claymore&show=0');
    });

    it('calculates the offset from currentPage', () => {
        const url = buildSearchUrl('https://myanimelist.net', 'anime', 'naruto', 2);
        assert.equal(url, 'https://myanimelist.net/anime.php?q=naruto&show=100');
    });

    it('builds the correct URL for manga', () => {
        const url = buildSearchUrl('https://myanimelist.net', 'manga', 'claymore', 1);
        assert.equal(url, 'https://myanimelist.net/manga.php?q=claymore&show=50');
    });

    it('builds the correct URL for character', () => {
        const url = buildSearchUrl('https://myanimelist.net', 'character', 'goku', 0);
        assert.equal(url, 'https://myanimelist.net/character.php?q=goku&show=0');
    });

    it('respects a custom baseUrl', () => {
        const url = buildSearchUrl('http://localhost:8080', 'anime', 'test', 0);
        assert.equal(url, 'http://localhost:8080/anime.php?q=test&show=0');
    });
});

describe('buildSearchSelector', () => {
    it('returns the nested table selector for anime', () => {
        const { parent, selector } = buildSearchSelector('anime');
        assert.equal(parent, 'div#content > div > table');
        assert.equal(selector, 'div#content > div > table tr');
    });

    it('returns the nested table selector for manga', () => {
        const { parent, selector } = buildSearchSelector('manga');
        assert.equal(parent, 'div#content > div > table');
        assert.equal(selector, 'div#content > div > table tr');
    });

    it('returns the flat table selector for character', () => {
        const { parent, selector } = buildSearchSelector('character');
        assert.equal(parent, 'div#content > table');
        assert.equal(selector, 'div#content > table tr');
    });

    it('returns the flat table selector for people', () => {
        const { parent, selector } = buildSearchSelector('people');
        assert.equal(parent, 'div#content > table');
        assert.equal(selector, 'div#content > table tr');
    });
});

describe('hasSearchHeader', () => {
    it('returns true for anime', () => {
        assert.equal(hasSearchHeader('anime'), true);
    });

    it('returns true for manga', () => {
        assert.equal(hasSearchHeader('manga'), true);
    });

    it('returns false for character', () => {
        assert.equal(hasSearchHeader('character'), false);
    });

    it('returns false for people', () => {
        assert.equal(hasSearchHeader('people'), false);
    });
});
