'use strict';

const VALID_TYPES = ['anime', 'manga', 'character', 'people'];

/**
 * Validates the parameters for the search endpoint.
 *
 * @param {string} type - Required. Must be one of 'anime' | 'manga' | 'character' | 'people'.
 * @param {string} query - Required. Must be a non-empty string after trimming.
 * @param {string|number|undefined} page - Optional. If present, must be a non-negative integer.
 * @returns {{ field: string, message: string }[]} Array of validation errors — empty if all params are valid.
 */
function validateSearchParams(type, query, page) {
    const errors = [];

    if (!type || !VALID_TYPES.includes(type)) {
        errors.push({
            field: 'type',
            message: `Invalid 'type' parameter. Must be one of: ${VALID_TYPES.join(', ')}.`,
        });
    }

    if (!query || !String(query).trim()) {
        errors.push({
            field: 'query',
            message: "The 'query' parameter must be a non-empty string.",
        });
    }

    if (page !== undefined && page !== null) {
        const num = Number(page);
        if (!Number.isInteger(num) || num < 0) {
            errors.push({
                field: 'page',
                message: "The 'page' parameter must be a non-negative integer.",
            });
        }
    }

    return errors;
}

module.exports = { validateSearchParams };
