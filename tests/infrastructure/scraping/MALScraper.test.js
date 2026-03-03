'use strict';

const { describe, it } = require('node:test');
const assert = require('node:assert/strict');
const MALScraper = require('../../../infrastructure/scraping/MALScraper');
const FakePage = require('./FakePage');
const FakeBrowser = require('./FakeBrowser');

// Raw strings matching the format produced by page.eval in the real scraper.
// These are the same fixtures used by the mapper tests.
const SEARCH_HEADER_ROW = 'Title\tType\tEps.\tScore';
const CLAYMORE_SEARCH_RAW =
    'Claymore\nadd\n' +
    'When a shapeshifting demon with a thirst for human flesh, known as "youma," arrives ' +
    "in Raki's village, a lone woman with silver eyes walks into town with only a sword upon " +
    'her back. She is a "Claymore...read more.\n\tTV\t26\t7.73';

const FRIEREN_SEASONAL_RAW =
    "Sousou no Frieren 2nd Season\n" +
    "Frieren: Beyond Journey's End Season 2\n" +
    "Jan 16, 2026 10 eps, 24 min\n" +
    "AdventureDramaFantasy\n" +
    " Sousou no Frieren 2nd Season\n" +
    "\n" +
    "Following the First-Class Mage Exam, the trio—elven mage Frieren, warrior Stark, and " +
    "first-class mage Fern—gains access to the dangerous Northern Plateau.\n" +
    "\n" +
    "[Written by MAL Rewrite]\n" +
    "\n" +
    "StudioMadhouse\n" +
    "SourceManga\n" +
    "DemographicShounen\n" +
    "9.18\n" +
    "406K\n" +
    "Add to My List";

describe('MALScraper', () => {
    describe('search()', () => {
        it('returns mapped results for a successful anime search', async () => {
            const page = new FakePage({ items: [SEARCH_HEADER_ROW, CLAYMORE_SEARCH_RAW] });
            const scraper = new MALScraper(new FakeBrowser(page));

            const results = await scraper.search('anime', 'claymore', 0);

            assert.equal(results.length, 1);
            assert.equal(results[0].name, 'Claymore');
            assert.equal(results[0].type, 'TV');
            assert.equal(results[0].episodes, 26);
            assert.equal(results[0].score, 7.73);
        });

        it('strips the header row for manga searches', async () => {
            const page = new FakePage({ items: [SEARCH_HEADER_ROW, CLAYMORE_SEARCH_RAW] });
            const scraper = new MALScraper(new FakeBrowser(page));

            const results = await scraper.search('manga', 'claymore', 0);

            assert.equal(results.length, 1);
        });

        it('does not strip a header row for character searches', async () => {
            const RAW_CHARACTER = 'Claymore Character\nadd\nA character.\n\t-\t-\t-';
            const page = new FakePage({ items: [RAW_CHARACTER] });
            const scraper = new MALScraper(new FakeBrowser(page));

            const results = await scraper.search('character', 'claymore', 0);

            assert.equal(results.length, 1);
        });

        it('throws on 404', async () => {
            const page = new FakePage({ statusCode: 404 });
            const scraper = new MALScraper(new FakeBrowser(page));

            await assert.rejects(
                () => scraper.search('anime', 'notfound', 0),
                { message: '404: Page not found' },
            );
        });
    });

    describe('seasonalAnime()', () => {
        it('returns mapped results for the current season', async () => {
            const page = new FakePage({ items: [FRIEREN_SEASONAL_RAW] });
            const scraper = new MALScraper(new FakeBrowser(page));

            const results = await scraper.seasonalAnime();

            assert.equal(results.length, 1);
            assert.equal(results[0].name, 'Sousou no Frieren 2nd Season');
            assert.equal(results[0].studio, 'Madhouse');
            assert.equal(results[0].score, 9.18);
        });

        it('returns mapped results for a specific season', async () => {
            const page = new FakePage({ items: [FRIEREN_SEASONAL_RAW] });
            const scraper = new MALScraper(new FakeBrowser(page));

            const results = await scraper.seasonalAnime('2026', 'winter');

            assert.equal(results.length, 1);
            assert.equal(results[0].name, 'Sousou no Frieren 2nd Season');
        });

        it('returns mapped results filtered by category', async () => {
            const page = new FakePage({ items: [FRIEREN_SEASONAL_RAW] });
            const scraper = new MALScraper(new FakeBrowser(page));

            const results = await scraper.seasonalAnime(null, null, 'tv');

            assert.equal(results.length, 1);
        });

        it('throws on 404', async () => {
            const page = new FakePage({ statusCode: 404 });
            const scraper = new MALScraper(new FakeBrowser(page));

            await assert.rejects(
                () => scraper.seasonalAnime('1990', 'spring'),
                { message: '404: Page not found' },
            );
        });
    });
});
