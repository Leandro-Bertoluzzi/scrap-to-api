'use strict';

const express = require('express');
const createSearchRouter = require('./routes/search');
const createListsRouter = require('./routes/lists');

/**
 * Creates and configures the Express application.
 *
 * @param {import('../../application/use-cases/SearchUseCase')} searchUseCase
 * @param {import('../../application/use-cases/ListSeasonalAnimeUseCase')} listSeasonalAnimeUseCase
 * @returns {express.Application}
 */
function createServer(searchUseCase, listSeasonalAnimeUseCase) {
    const app = express();

    app.use(express.json());

    // Home
    app.get('/', (req, res) => {
        res.send('Hello World');
    });

    // Routes
    app.use('/search', createSearchRouter(searchUseCase));
    app.use('/list', createListsRouter(listSeasonalAnimeUseCase));

    return app;
}

module.exports = createServer;
