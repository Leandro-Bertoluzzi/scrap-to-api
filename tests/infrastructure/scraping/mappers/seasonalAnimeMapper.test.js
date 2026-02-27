'use strict';

const { describe, it } = require('node:test');
const assert = require('node:assert/strict');
const seasonalAnimeMapper = require('../../../../infrastructure/scraping/mappers/seasonalAnimeMapper');

// Real example captured from MAL seasonal page
const FRIEREN_RAW =
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

describe('seasonalAnimeMapper', () => {
    describe('name', () => {
        it('extracts the name from the first line', () => {
            assert.equal(seasonalAnimeMapper(FRIEREN_RAW).name, 'Sousou no Frieren 2nd Season');
        });
    });

    describe('startDate', () => {
        it('extracts the start date', () => {
            assert.equal(seasonalAnimeMapper(FRIEREN_RAW).startDate, 'Jan 16, 2026');
        });

        it('returns null when no date is present', () => {
            const raw =
                "Some Anime\nAlt Title\nNo date here\nGenres\n Name\n\nDesc.\n\n[Written by MAL Rewrite]\n\nStudioA\nSourceB\nDemographicC\n7.00\n100K\nAdd to My List";
            assert.equal(seasonalAnimeMapper(raw).startDate, null);
        });
    });

    describe('episodes', () => {
        it('extracts episode count as an integer', () => {
            assert.equal(seasonalAnimeMapper(FRIEREN_RAW).episodes, 10);
        });

        it('returns null when episodes are not specified', () => {
            const raw =
                "Some Anime\nAlt Title\nJan 1, 2026\nGenres\n Name\n\nDesc.\n\n[Written by MAL Rewrite]\n\nStudioA\nSourceB\nDemographicC\n7.00\n100K\nAdd to My List";
            assert.equal(seasonalAnimeMapper(raw).episodes, null);
        });
    });

    describe('description', () => {
        it('extracts description paragraphs between header and metadata', () => {
            const result = seasonalAnimeMapper(FRIEREN_RAW);
            assert.ok(result.description.includes('First-Class Mage Exam'));
        });

        it('does not include "[Written by MAL Rewrite]" in description', () => {
            assert.ok(!seasonalAnimeMapper(FRIEREN_RAW).description.includes('[Written by MAL Rewrite]'));
        });

        it('does not include metadata lines in description', () => {
            const result = seasonalAnimeMapper(FRIEREN_RAW);
            assert.ok(!result.description.includes('Madhouse'));
            assert.ok(!result.description.includes('9.18'));
        });
    });

    describe('studio', () => {
        it('extracts the studio name', () => {
            assert.equal(seasonalAnimeMapper(FRIEREN_RAW).studio, 'Madhouse');
        });

        it('returns null when studio is absent', () => {
            const raw =
                "Some Anime\nAlt\nJan 1, 2026 10 eps, 24 min\nGenres\n Name\n\nDesc.\n\n[Written by MAL Rewrite]\n\nSourceManga\nDemographicShounen\n7.00\n100K\nAdd to My List";
            assert.equal(seasonalAnimeMapper(raw).studio, null);
        });
    });

    describe('source', () => {
        it('extracts the source material', () => {
            assert.equal(seasonalAnimeMapper(FRIEREN_RAW).source, 'Manga');
        });

        it('returns null when source is absent', () => {
            const raw =
                "Some Anime\nAlt\nJan 1, 2026 10 eps, 24 min\nGenres\n Name\n\nDesc.\n\n[Written by MAL Rewrite]\n\nStudioMadhouse\nDemographicShounen\n7.00\n100K\nAdd to My List";
            assert.equal(seasonalAnimeMapper(raw).source, null);
        });
    });

    describe('demographics', () => {
        it('extracts the demographic', () => {
            assert.equal(seasonalAnimeMapper(FRIEREN_RAW).demographics, 'Shounen');
        });

        it('returns null when demographic is absent', () => {
            const raw =
                "Some Anime\nAlt\nJan 1, 2026 10 eps, 24 min\nGenres\n Name\n\nDesc.\n\n[Written by MAL Rewrite]\n\nStudioMadhouse\nSourceManga\n7.00\n100K\nAdd to My List";
            assert.equal(seasonalAnimeMapper(raw).demographics, null);
        });
    });

    describe('score', () => {
        it('extracts the score as a float', () => {
            assert.equal(seasonalAnimeMapper(FRIEREN_RAW).score, 9.18);
        });

        it('returns null when score is not yet available', () => {
            const raw =
                "New Anime\nAlt\nJan 1, 2026 12 eps, 24 min\nGenres\n Name\n\nDesc.\n\n[Written by MAL Rewrite]\n\nStudioA\nSourceB\nDemographicC\nN/A\n100K\nAdd to My List";
            assert.equal(seasonalAnimeMapper(raw).score, null);
        });
    });

    describe('result shape', () => {
        it('returns an object with all expected keys', () => {
            const result = seasonalAnimeMapper(FRIEREN_RAW);
            const expectedKeys = ['name', 'description', 'startDate', 'episodes', 'studio', 'source', 'demographics', 'score'];
            for (const key of expectedKeys) {
                assert.ok(Object.hasOwn(result, key), `Missing key: ${key}`);
            }
        });
    });
});
