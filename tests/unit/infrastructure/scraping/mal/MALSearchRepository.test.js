'use strict';

const { describe, it } = require('node:test');
const assert = require('node:assert/strict');
const MALSearchRepository = require('../../../../../infrastructure/scraping/mal/MALSearchRepository');
const FakePage = require('../FakePage');
const FakeBrowser = require('../FakeBrowser');

const SEARCH_HEADER_ROW = 'Title\tType\tEps.\tScore';
const CLAYMORE_SEARCH_RAW =
    'Claymore\nadd\n' +
    'When a shapeshifting demon with a thirst for human flesh, known as "youma," arrives ' +
    "in Raki's village, a lone woman with silver eyes walks into town with only a sword upon " +
    'her back. She is a "Claymore...read more.\n\tTV\t26\t7.73';

describe('MALSearchRepository', () => {
    describe('search()', () => {
        it('returns mapped results for a successful anime search', async () => {
            const page = new FakePage({ items: [SEARCH_HEADER_ROW, CLAYMORE_SEARCH_RAW] });
            const repo = new MALSearchRepository(new FakeBrowser(page));

            const results = await repo.search('anime', 'claymore', 0);

            assert.equal(results.length, 1);
            assert.equal(results[0].name, 'Claymore');
            assert.equal(results[0].type, 'TV');
            assert.equal(results[0].episodes, 26);
            assert.equal(results[0].score, 7.73);
        });

        it('strips the header row for manga searches', async () => {
            const page = new FakePage({ items: [SEARCH_HEADER_ROW, CLAYMORE_SEARCH_RAW] });
            const repo = new MALSearchRepository(new FakeBrowser(page));

            const results = await repo.search('manga', 'claymore', 0);

            assert.equal(results.length, 1);
        });

        it('does not strip a header row for character searches', async () => {
            const RAW_CHARACTER = 'Claymore Character\nadd\nA character.\n\t-\t-\t-';
            const page = new FakePage({ items: [RAW_CHARACTER] });
            const repo = new MALSearchRepository(new FakeBrowser(page));

            const results = await repo.search('character', 'claymore', 0);

            assert.equal(results.length, 1);
        });

        it('returns an empty array when no results are found', async () => {
            const page = new FakePage({ items: [] });
            const repo = new MALSearchRepository(new FakeBrowser(page));

            const results = await repo.search('anime', 'notfound', 0);

            assert.deepEqual(results, []);
        });

        it('throws on 404', async () => {
            const page = new FakePage({ statusCode: 404 });
            const repo = new MALSearchRepository(new FakeBrowser(page));

            await assert.rejects(
                () => repo.search('anime', 'notfound', 0),
                { message: '404: Page not found' },
            );
        });
    });
});
