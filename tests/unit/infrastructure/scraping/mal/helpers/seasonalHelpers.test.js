'use strict';

const { describe, it } = require('node:test');
const assert = require('node:assert/strict');
const { buildSeasonalUrl, buildSeasonalFilter } = require('../../../../../../infrastructure/scraping/mal/helpers/seasonalHelpers');

describe('buildSeasonalUrl', () => {
    it('returns the current-season URL when year and season are omitted', () => {
        assert.equal(
            buildSeasonalUrl('https://myanimelist.net', null, null),
            'https://myanimelist.net/anime/season',
        );
    });

    it('returns the specific-season URL when year and season are provided', () => {
        assert.equal(
            buildSeasonalUrl('https://myanimelist.net', '2024', 'spring'),
            'https://myanimelist.net/anime/season/2024/spring',
        );
    });

    it('returns the current-season URL when only year is provided', () => {
        assert.equal(
            buildSeasonalUrl('https://myanimelist.net', '2024', null),
            'https://myanimelist.net/anime/season',
        );
    });

    it('returns the current-season URL when only season is provided', () => {
        assert.equal(
            buildSeasonalUrl('https://myanimelist.net', null, 'winter'),
            'https://myanimelist.net/anime/season',
        );
    });

    it('respects a custom baseUrl', () => {
        assert.equal(
            buildSeasonalUrl('http://localhost:8080', '2025', 'fall'),
            'http://localhost:8080/anime/season/2025/fall',
        );
    });
});

describe('buildSeasonalFilter', () => {
    it('returns both TV header texts for category "tv"', () => {
        const { headers } = buildSeasonalFilter('tv');
        assert.deepEqual(headers, ['TV (New)', 'TV (Continuing)']);
    });

    it('returns only "TV (New)" for category "tv_new"', () => {
        const { headers } = buildSeasonalFilter('tv_new');
        assert.deepEqual(headers, ['TV (New)']);
    });

    it('returns only "TV (Continuing)" for category "tv_continuing"', () => {
        const { headers } = buildSeasonalFilter('tv_continuing');
        assert.deepEqual(headers, ['TV (Continuing)']);
    });

    it('returns the correct header text for ova', () => {
        const { headers } = buildSeasonalFilter('ova');
        assert.deepEqual(headers, ['OVA']);
    });

    it('returns the correct header text for movie', () => {
        const { headers } = buildSeasonalFilter('movie');
        assert.deepEqual(headers, ['Movie']);
    });

    it('returns the correct header text for special', () => {
        const { headers } = buildSeasonalFilter('special');
        assert.deepEqual(headers, ['Special']);
    });

    it('returns the correct header text for ona', () => {
        const { headers } = buildSeasonalFilter('ona');
        assert.deepEqual(headers, ['ONA']);
    });

    it('returns null headers when category is null', () => {
        const { headers } = buildSeasonalFilter(null);
        assert.equal(headers, null);
    });

    it('returns null headers for an unknown category', () => {
        const { headers } = buildSeasonalFilter('unknown');
        assert.equal(headers, null);
    });
});
