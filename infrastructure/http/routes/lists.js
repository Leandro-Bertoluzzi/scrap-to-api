'use strict';

const express = require('express');

/**
 * HTTP adapter: Lists
 *
 * Returns lists of anime/manga based on criteria (seasonal, top, etc).
 *
 * @param {import('../../../application/use-cases/ListSeasonalAnimeUseCase')} listSeasonalAnimeUseCase
 * @returns {express.Router}
 */
function createListsRouter(listSeasonalAnimeUseCase) {
    const router = express.Router();

    // Lists seasonal anime
    router.get('/anime/season', async function (req, res) {
        const year = req.query.year || null;
        const season = req.query.season ? req.query.season.toLowerCase() : 'summer';
        const category = req.query.cat ? req.query.cat.toLowerCase() : null;

        try {
            const data = await listSeasonalAnimeUseCase.execute(year, season, category);
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

module.exports = createListsRouter;
