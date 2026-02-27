'use strict';

const express = require('express');

/**
 * HTTP adapter: Search
 *
 * Returns search results for anime/manga/characters/people/companies based on a query and pagination.
 *
 * @param {import('../../../application/use-cases/SearchUseCase')} searchUseCase
 * @returns {express.Router}
 */
function createSearchRouter(searchUseCase) {
    const router = express.Router();

    // Searches an anime/manga/character/people/company
    router.get('/:type', async function (req, res) {
        const type = req.params.type || null;
        if (!type) {
            return res.status(400).json({ error: 'No type provided' });
        }

        const query = req.query.query || '';
        const page = req.query.page || 0;

        try {
            const data = await searchUseCase.execute(type, query, page);
            const values = JSON.parse(JSON.stringify(data));
            res.status(200).json({ result: values });
        } catch (error) {
            console.log('There was an error: ', error);
            const errorMessage = JSON.parse(JSON.stringify(error.message));
            res.status(400).json({ error: errorMessage });
        }
    });

    return router;
}

module.exports = createSearchRouter;
