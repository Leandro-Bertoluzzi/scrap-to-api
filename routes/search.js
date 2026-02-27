const express = require('express');
const router = express.Router();
const Browser = require('../services/browser');
const Scraper = require('../services/pageScraper');

// Middleware for JSON
router.use(express.json());

// Searches an anime/manga/character/people/company
router.get('/:type', async function (req, res) {
    const type = req.params.type || null;
    if (!type) {
        res.status(400).json({ error: 'No type provided' });
    }

    const searchQuery = req.query.query || '';
    const currentPage = req.query.page || 0;

    try {
        const browser = new Browser();
        await browser.start();
        const myScraper = new Scraper(browser.instance);
        const data = await myScraper.search(
            type,
            searchQuery,
            currentPage
        );
        await browser.close();

        const values = JSON.parse(JSON.stringify(data));
        res.status(200).json({ result: values });
    } catch (error) {
        console.log('There was an error: ', error);
        const errorMessage = JSON.parse(JSON.stringify(error.message));
        res.status(400).json({ error: errorMessage });
    }
});

module.exports = router;
