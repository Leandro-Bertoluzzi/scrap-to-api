'use strict';

const { describe, it } = require('node:test');
const assert = require('node:assert/strict');
const { validateListSeasonalParams } = require('../../../../../infrastructure/http/validators/listValidator');

describe('validateListSeasonalParams', () => {
    const CURRENT_YEAR = new Date().getFullYear();

    describe('year', () => {
        it('is valid when year is null', () => {
            assert.deepEqual(validateListSeasonalParams(null, null, null), []);
        });

        it('is valid with "2024"', () => {
            assert.deepEqual(validateListSeasonalParams('2024', null, null), []);
        });

        it('is valid with the current year', () => {
            assert.deepEqual(validateListSeasonalParams(String(CURRENT_YEAR), null, null), []);
        });

        it('is valid with "1900"', () => {
            assert.deepEqual(validateListSeasonalParams('1900', null, null), []);
        });

        it('returns an error for "1899" (below minimum)', () => {
            const errors = validateListSeasonalParams('1899', null, null);
            assert.equal(errors.length, 1);
            assert.equal(errors[0].field, 'year');
        });

        it('returns an error for a future year', () => {
            const errors = validateListSeasonalParams(String(CURRENT_YEAR + 1), null, null);
            assert.equal(errors.length, 1);
            assert.equal(errors[0].field, 'year');
        });

        it('returns an error for a non-numeric string', () => {
            const errors = validateListSeasonalParams('abc', null, null);
            assert.equal(errors.length, 1);
            assert.equal(errors[0].field, 'year');
        });

        it('returns an error for a decimal value', () => {
            const errors = validateListSeasonalParams('2024.5', null, null);
            assert.equal(errors.length, 1);
            assert.equal(errors[0].field, 'year');
        });
    });

    describe('season', () => {
        for (const season of ['summer', 'fall', 'winter', 'spring']) {
            it(`is valid for "${season}"`, () => {
                assert.deepEqual(validateListSeasonalParams(null, season, null), []);
            });
        }

        it('is valid when season is null', () => {
            assert.deepEqual(validateListSeasonalParams(null, null, null), []);
        });

        it('returns an error for an unknown season', () => {
            const errors = validateListSeasonalParams(null, 'autumn', null);
            assert.equal(errors.length, 1);
            assert.equal(errors[0].field, 'season');
        });

        it('returns an error for an empty string', () => {
            const errors = validateListSeasonalParams(null, '', null);
            assert.equal(errors.length, 1);
            assert.equal(errors[0].field, 'season');
        });
    });

    describe('category', () => {
        for (const cat of ['tv', 'tv_new', 'tv_continuing', 'ova', 'movie', 'special', 'ona']) {
            it(`is valid for "${cat}"`, () => {
                assert.deepEqual(validateListSeasonalParams(null, null, cat), []);
            });
        }

        it('is valid when category is null', () => {
            assert.deepEqual(validateListSeasonalParams(null, null, null), []);
        });

        it('returns an error for an unknown category', () => {
            const errors = validateListSeasonalParams(null, null, 'series');
            assert.equal(errors.length, 1);
            assert.equal(errors[0].field, 'cat');
        });

        it('returns an error for an empty string', () => {
            const errors = validateListSeasonalParams(null, null, '');
            assert.equal(errors.length, 1);
            assert.equal(errors[0].field, 'cat');
        });
    });

    describe('multiple errors', () => {
        it('accumulates errors for all invalid params simultaneously', () => {
            const errors = validateListSeasonalParams('1800', 'autumn', 'series');
            assert.equal(errors.length, 3);
            assert.deepEqual(errors.map((e) => e.field), ['year', 'season', 'cat']);
        });

        it('accumulates errors for year and season when both are invalid', () => {
            const errors = validateListSeasonalParams('abc', 'monsoon', null);
            assert.equal(errors.length, 2);
            assert.deepEqual(errors.map((e) => e.field), ['year', 'season']);
        });
    });
});
