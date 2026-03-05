'use strict';

const express = require('express');
const { validateListSeasonalParams } = require('../validators/listValidator');

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
    router.get('/anime/season', async function (req, res, next) {
        const year = req.query.year || null;
        const season = req.query.season ? req.query.season.toLowerCase() : null;
        const category = req.query.cat ? req.query.cat.toLowerCase() : null;

        const errors = validateListSeasonalParams(year, season, category);
        if (errors.length > 0) {
            return res.status(400).json({ error: errors });
        }

        try {
            const data = await listSeasonalAnimeUseCase.execute(year, season, category);
            const values = JSON.parse(JSON.stringify(data));
            res.status(200).json({ result: values });
        } catch (error) {
            next(error);
        }
    });

    return router;
}

module.exports = createListsRouter;
