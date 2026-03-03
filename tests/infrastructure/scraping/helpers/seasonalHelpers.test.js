'use strict';

const { describe, it } = require('node:test');
const assert = require('node:assert/strict');
const {
    buildSeasonalUrl,
    buildSeasonalSelector,
} = require('../../../../infrastructure/scraping/helpers/seasonalHelpers');

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

describe('buildSeasonalSelector', () => {
    it('returns a selector without category class when category is null', () => {
        const { parent, selector } = buildSeasonalSelector(null);
        assert.equal(parent, 'div#content > div > div.seasonal-anime-list');
        assert.equal(selector, 'div#content > div > div.seasonal-anime-list div.seasonal-anime');
    });

    it('returns the correct selector for tv', () => {
        const { parent, selector } = buildSeasonalSelector('tv');
        assert.equal(parent, 'div#content > div > div.seasonal-anime-list.js-seasonal-anime-list-key-1');
        assert.equal(selector, `${parent} div.seasonal-anime`);
    });

    it('returns the correct selector for ova', () => {
        const { parent, selector } = buildSeasonalSelector('ova');
        assert.equal(parent, 'div#content > div > div.seasonal-anime-list.js-seasonal-anime-list-key-2');
        assert.equal(selector, `${parent} div.seasonal-anime`);
    });

    it('returns the correct selector for movie', () => {
        const { parent, selector } = buildSeasonalSelector('movie');
        assert.equal(parent, 'div#content > div > div.seasonal-anime-list.js-seasonal-anime-list-key-3');
        assert.equal(selector, `${parent} div.seasonal-anime`);
    });

    it('returns the correct selector for special', () => {
        const { parent, selector } = buildSeasonalSelector('special');
        assert.equal(parent, 'div#content > div > div.seasonal-anime-list.js-seasonal-anime-list-key-4');
        assert.equal(selector, `${parent} div.seasonal-anime`);
    });

    it('returns the correct selector for ona', () => {
        const { parent, selector } = buildSeasonalSelector('ona');
        assert.equal(parent, 'div#content > div > div.seasonal-anime-list.js-seasonal-anime-list-key-5');
        assert.equal(selector, `${parent} div.seasonal-anime`);
    });
});
