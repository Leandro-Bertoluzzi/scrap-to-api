'use strict';

const { describe, it } = require('node:test');
const assert = require('node:assert/strict');
const { validateSearchParams } = require('../../../../../infrastructure/http/validators/searchValidator');

describe('validateSearchParams', () => {
    describe('type', () => {
        for (const type of ['anime', 'manga', 'character', 'people']) {
            it(`is valid for "${type}"`, () => {
                assert.deepEqual(validateSearchParams(type, 'query', undefined), []);
            });
        }

        it('returns an error for an unknown type', () => {
            const errors = validateSearchParams('unknown', 'query', undefined);
            assert.equal(errors.length, 1);
            assert.equal(errors[0].field, 'type');
        });

        it('returns an error when type is empty string', () => {
            const errors = validateSearchParams('', 'query', undefined);
            assert.equal(errors.length, 1);
            assert.equal(errors[0].field, 'type');
        });

        it('returns an error when type is undefined', () => {
            const errors = validateSearchParams(undefined, 'query', undefined);
            assert.equal(errors.length, 1);
            assert.equal(errors[0].field, 'type');
        });
    });

    describe('query', () => {
        it('is valid with a non-empty string', () => {
            assert.deepEqual(validateSearchParams('anime', 'claymore', undefined), []);
        });

        it('returns an error when query is an empty string', () => {
            const errors = validateSearchParams('anime', '', undefined);
            assert.equal(errors.length, 1);
            assert.equal(errors[0].field, 'query');
        });

        it('returns an error when query is only whitespace', () => {
            const errors = validateSearchParams('anime', '   ', undefined);
            assert.equal(errors.length, 1);
            assert.equal(errors[0].field, 'query');
        });

        it('returns an error when query is undefined', () => {
            const errors = validateSearchParams('anime', undefined, undefined);
            assert.equal(errors.length, 1);
            assert.equal(errors[0].field, 'query');
        });
    });

    describe('page', () => {
        it('is valid when page is undefined', () => {
            assert.deepEqual(validateSearchParams('anime', 'claymore', undefined), []);
        });

        it('is valid with "0"', () => {
            assert.deepEqual(validateSearchParams('anime', 'claymore', '0'), []);
        });

        it('is valid with "5"', () => {
            assert.deepEqual(validateSearchParams('anime', 'claymore', '5'), []);
        });

        it('is valid with the number 0', () => {
            assert.deepEqual(validateSearchParams('anime', 'claymore', 0), []);
        });

        it('returns an error for "-1"', () => {
            const errors = validateSearchParams('anime', 'claymore', '-1');
            assert.equal(errors.length, 1);
            assert.equal(errors[0].field, 'page');
        });

        it('returns an error for a decimal "1.5"', () => {
            const errors = validateSearchParams('anime', 'claymore', '1.5');
            assert.equal(errors.length, 1);
            assert.equal(errors[0].field, 'page');
        });

        it('returns an error for a non-numeric string "abc"', () => {
            const errors = validateSearchParams('anime', 'claymore', 'abc');
            assert.equal(errors.length, 1);
            assert.equal(errors[0].field, 'page');
        });
    });

    describe('multiple errors', () => {
        it('accumulates errors for all invalid params simultaneously', () => {
            const errors = validateSearchParams('badtype', '', 'abc');
            assert.equal(errors.length, 3);
            assert.deepEqual(errors.map((e) => e.field), ['type', 'query', 'page']);
        });

        it('accumulates errors for type and query when both are invalid', () => {
            const errors = validateSearchParams(undefined, '', undefined);
            assert.equal(errors.length, 2);
            assert.deepEqual(errors.map((e) => e.field), ['type', 'query']);
        });
    });
});
