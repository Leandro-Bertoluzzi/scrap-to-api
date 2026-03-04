'use strict';

const { describe, it } = require('node:test');
const assert = require('node:assert/strict');
const MALSeasonalRepository = require('../../../../../infrastructure/scraping/mal/MALSeasonalRepository');
const FakePage = require('../FakePage');
const FakeBrowser = require('../FakeBrowser');

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

describe('MALSeasonalRepository', () => {
    describe('seasonalAnime()', () => {
        it('returns mapped results for the current season', async () => {
            const page = new FakePage({ items: [FRIEREN_SEASONAL_RAW] });
            const repo = new MALSeasonalRepository(new FakeBrowser(page));

            const results = await repo.seasonalAnime();

            assert.equal(results.length, 1);
            assert.equal(results[0].name, 'Sousou no Frieren 2nd Season');
            assert.equal(results[0].studio, 'Madhouse');
            assert.equal(results[0].score, 9.18);
        });

        it('returns mapped results for a specific season', async () => {
            const page = new FakePage({ items: [FRIEREN_SEASONAL_RAW] });
            const repo = new MALSeasonalRepository(new FakeBrowser(page));

            const results = await repo.seasonalAnime('2026', 'winter');

            assert.equal(results.length, 1);
            assert.equal(results[0].name, 'Sousou no Frieren 2nd Season');
        });

        it('returns mapped results filtered by category', async () => {
            const page = new FakePage({ items: [FRIEREN_SEASONAL_RAW] });
            const repo = new MALSeasonalRepository(new FakeBrowser(page));

            const results = await repo.seasonalAnime(null, null, 'tv');

            assert.equal(results.length, 1);
        });

        it('returns an empty array when no results are found', async () => {
            const page = new FakePage({ items: [] });
            const repo = new MALSeasonalRepository(new FakeBrowser(page));

            const results = await repo.seasonalAnime('1990', 'spring');

            assert.deepEqual(results, []);
        });

        it('throws on 404', async () => {
            const page = new FakePage({ statusCode: 404 });
            const repo = new MALSeasonalRepository(new FakeBrowser(page));

            await assert.rejects(
                () => repo.seasonalAnime('1990', 'spring'),
                { message: '404: Page not found' },
            );
        });

        it('derives category from the header text', async () => {
            const page = new FakePage({
                items: [{ text: FRIEREN_SEASONAL_RAW, header: 'TV (New)' }],
            });
            const repo = new MALSeasonalRepository(new FakeBrowser(page));

            const results = await repo.seasonalAnime();

            assert.equal(results[0].category, 'tv_new');
        });

        it('sets category to null when header text is unrecognised', async () => {
            const page = new FakePage({
                items: [{ text: FRIEREN_SEASONAL_RAW, header: '' }],
            });
            const repo = new MALSeasonalRepository(new FakeBrowser(page));

            const results = await repo.seasonalAnime();

            assert.equal(results[0].category, null);
        });
    });
});
