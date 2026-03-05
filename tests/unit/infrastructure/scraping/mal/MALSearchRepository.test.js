'use strict';

const { describe, it } = require('node:test');
const assert = require('node:assert/strict');
const MALSearchRepository = require('../../../../../infrastructure/scraping/mal/MALSearchRepository');
const FakePage = require('../FakePage');
const FakeBrowser = require('../FakeBrowser');

const SEARCH_HEADER_ROW = 'Title\tType\tEps.\tScore';
const EXAMPLE_ANIME_SEARCH_RAW =
    'Example Anime\nadd\n' +
    'This is an example anime description that is quite long and ends with the read more prompt...read more.\n\tTV\t24\t8.20';
const EXAMPLE_MANGA_SEARCH_RAW =
    'Example Manga\nadd Read Manga\n' +
    'This is an example manga description that is quite long and ends with the read more prompt...read more.\n\tManga\t12\t8.50';
const EXAMPLE_CHARACTER_SEARCH_RAW =
    'Example Character\n(Example Alternate Name)\tAnime: Example Anime';
const EXAMPLE_PEOPLE_SEARCH_RAW =
    'Doe, John\n(ジョン・ドウ)';

describe('MALSearchRepository', () => {
    describe('headers', () => {
        it('strips the header row for anime searches', async () => {
            const page = new FakePage({ items: [SEARCH_HEADER_ROW, EXAMPLE_ANIME_SEARCH_RAW] });
            const repo = new MALSearchRepository(new FakeBrowser(page));

            const results = await repo.search('anime', 'example', 0);

            assert.equal(results.length, 1);
        });

        it('strips the header row for manga searches', async () => {
            const page = new FakePage({ items: [SEARCH_HEADER_ROW, EXAMPLE_MANGA_SEARCH_RAW] });
            const repo = new MALSearchRepository(new FakeBrowser(page));

            const results = await repo.search('manga', 'example', 0);

            assert.equal(results.length, 1);
        });

        it('does not strip a header row for character searches', async () => {
            const page = new FakePage({ items: [EXAMPLE_CHARACTER_SEARCH_RAW] });
            const repo = new MALSearchRepository(new FakeBrowser(page));

            const results = await repo.search('character', 'example', 0);

            assert.equal(results.length, 1);
        });

        it('does not strip a header row for people searches', async () => {
            const page = new FakePage({ items: [EXAMPLE_PEOPLE_SEARCH_RAW] });
            const repo = new MALSearchRepository(new FakeBrowser(page));

            const results = await repo.search('people', 'example', 0);

            assert.equal(results.length, 1);
        });
    });

    describe('result mapping', () => {
        it('returns mapped results for a successful anime search', async () => {
            const page = new FakePage({ items: [SEARCH_HEADER_ROW, EXAMPLE_ANIME_SEARCH_RAW] });
            const repo = new MALSearchRepository(new FakeBrowser(page));

            const results = await repo.search('anime', 'example', 0);
            assert.equal(results.length, 1);

            const first = results[0];
            assert.equal(first.name, 'Example Anime');
            assert.equal(first.type, 'TV');
            assert.equal(first.episodes, 24);
            assert.equal(first.score, 8.20);
        });

        it('returns mapped results for a successful manga search', async () => {
            const page = new FakePage({ items: [SEARCH_HEADER_ROW, EXAMPLE_MANGA_SEARCH_RAW] });
            const repo = new MALSearchRepository(new FakeBrowser(page));

            const results = await repo.search('manga', 'example', 0);
            assert.equal(results.length, 1);

            const first = results[0];
            assert.equal(first.name, 'Example Manga');
            assert.equal(first.type, 'Manga');
            assert.equal(first.volumes, 12);
            assert.equal(first.score, 8.50);
        });

        it('returns mapped results for a successful character search', async () => {
            const page = new FakePage({ items: [EXAMPLE_CHARACTER_SEARCH_RAW] });
            const repo = new MALSearchRepository(new FakeBrowser(page));

            const results = await repo.search('character', 'example', 0);
            assert.equal(results.length, 1);

            const first = results[0];
            assert.equal(first.name, 'Example Character');
            assert.equal(first.alternateName, 'Example Alternate Name');
            assert.deepEqual(first.anime, ['Example Anime']);
            assert.deepEqual(first.manga, []);
        });

        it('returns mapped results for a successful people search', async () => {
            const page = new FakePage({ items: [EXAMPLE_PEOPLE_SEARCH_RAW] });
            const repo = new MALSearchRepository(new FakeBrowser(page));

            const results = await repo.search('people', 'example', 0);
            assert.equal(results.length, 1);

            const first = results[0];
            assert.equal(first.name, 'Doe, John');
            assert.equal(first.alternateName, 'ジョン・ドウ');
        });
    });

    describe('error handling', () => {
        it('returns an empty array when no results are found', async () => {
            const page = new FakePage({ items: [] });
            const repo = new MALSearchRepository(new FakeBrowser(page));

            for (const type of ['anime', 'manga', 'character', 'people']) {
                const results = await repo.search(type, 'notfound', 0);
                assert.deepEqual(results, []);
            }
        });

        it('throws on 404', async () => {
            const page = new FakePage({ statusCode: 404 });
            const repo = new MALSearchRepository(new FakeBrowser(page));

            await assert.rejects(
                () => repo.search('anime', 'notfound', 0),
                { message: 'Search page not found' },
            );
        });
    });
});
