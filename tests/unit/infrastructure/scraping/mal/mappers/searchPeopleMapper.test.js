'use strict';

const { describe, it } = require('node:test');
const assert = require('node:assert/strict');
const searchPeopleMapper = require('../../../../../../infrastructure/scraping/mal/mappers/searchPeopleMapper');

describe('searchPeopleMapper', () => {
    const SANO_RAW = 'Sano, Takashi\n(さの 隆)';
    const NO_ALTERNATE_RAW = 'Kira, Takashi';
    const QUOTED_RAW = '"Takashi"';

    describe('name', () => {
        it('extracts the name from the first line', () => {
            assert.equal(searchPeopleMapper(SANO_RAW).name, 'Sano, Takashi');
        });

        it('extracts a name with no alternate name', () => {
            assert.equal(searchPeopleMapper(NO_ALTERNATE_RAW).name, 'Kira, Takashi');
        });

        it('trims whitespace from name', () => {
            const raw = '  Sano, Takashi  \n(さの 隆)';
            assert.equal(searchPeopleMapper(raw).name, 'Sano, Takashi');
        });

        it('handles quoted name entries', () => {
            assert.equal(searchPeopleMapper(QUOTED_RAW).name, '"Takashi"');
        });
    });

    describe('alternateName', () => {
        it('extracts the alternate name from parentheses on the second line', () => {
            assert.equal(searchPeopleMapper(SANO_RAW).alternateName, 'さの 隆');
        });

        it('extracts alternate name with multiple aliases', () => {
            const raw = 'Takeuchi, Takashi\n(Takeuchi Tomotaka, 竹内友崇)';
            assert.equal(searchPeopleMapper(raw).alternateName, 'Takeuchi Tomotaka, 竹内友崇');
        });

        it('returns null when there is no second line', () => {
            assert.equal(searchPeopleMapper(NO_ALTERNATE_RAW).alternateName, null);
        });

        it('returns null when second line is not wrapped in parentheses', () => {
            const raw = 'Someone\nnot an alternate name';
            assert.equal(searchPeopleMapper(raw).alternateName, null);
        });
    });

    describe('result shape', () => {
        it('returns an object with all expected keys', () => {
            const result = searchPeopleMapper(SANO_RAW);
            assert.ok(Object.hasOwn(result, 'name'));
            assert.ok(Object.hasOwn(result, 'alternateName'));
        });
    });
});
