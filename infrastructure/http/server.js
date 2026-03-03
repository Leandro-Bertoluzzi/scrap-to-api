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

    // 404 handler
    app.use((req, res) => {
        res.status(404).json({ error: 'Not found' });
    });

    return app;
}

module.exports = createServer;
