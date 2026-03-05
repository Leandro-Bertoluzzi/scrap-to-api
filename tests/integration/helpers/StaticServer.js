'use strict';

const express = require('express');
const path = require('path');

const FIXTURES_DIR = path.join(__dirname, '../fixtures');

/**
 * Starts a local Express server that serves HTML fixture files at the same
 * URL paths that MALScraper builds (via buildSearchUrl / buildSeasonalUrl).
 *
 * Listening on port 0 lets the OS pick a free port, avoiding conflicts.
 *
 * @returns {Promise<{ url: string, close: () => Promise<void> }>}
 */
async function start() {
    const app = express();

    // Search routes — query-string params are ignored; the fixture covers any query.
    app.get('/anime.php', (_req, res) =>
        res.sendFile(path.join(FIXTURES_DIR, 'search-anime.html')),
    );
    app.get('/manga.php', (_req, res) =>
        res.sendFile(path.join(FIXTURES_DIR, 'search-manga.html')),
    );
    app.get('/character.php', (_req, res) =>
        res.sendFile(path.join(FIXTURES_DIR, 'search-character.html')),
    );
    app.get('/people.php', (_req, res) =>
        res.sendFile(path.join(FIXTURES_DIR, 'search-people.html')),
    );

    // Seasonal routes — specific season before the generic fallback.
    app.get('/anime/season/:year/:season', (req, res) => {
        const { year, season } = req.params;
        // Replicate MAL's behavior of redirecting to the current season page for out-of-range years/seasons.
        if (parseInt(year, 10) < 1917) {
            return res.redirect(303, '/anime/season');
        }
        res.sendFile(path.join(FIXTURES_DIR, `list-season-${year}-${season}.html`));
    });
    app.get('/anime/season', (_req, res) =>
        res.sendFile(path.join(FIXTURES_DIR, 'list-current-season.html')),
    );

    return new Promise((resolve, reject) => {
        const server = app.listen(0, (err) => {
            if (err) return reject(err);
            const { port } = server.address();
            resolve({
                url: `http://localhost:${port}`,
                close: () => new Promise((res) => server.close(res)),
            });
        });
    });
}

module.exports = { start };
