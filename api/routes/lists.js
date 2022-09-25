var express = require('express');
var router = express.Router();
const startBrowser = require('../services/browser');
const pageScraper = require('../services/pageScraper');

// Middleware for JSON
router.use(express.json());

// Lists seasonal anime
router.get("/anime/season", async function (req, res) {
  const year = req.query.year || null;
  const season = req.query.season ? req.query.season.toLowerCase() : 'summer';
  const category = req.query.cat ? req.query.cat.toLowerCase() : 'tv';
  
  try {
    const browser = await startBrowser();
    const data = await pageScraper.seasonalAnime(browser, year, season, category);
    browser.close();

    const values = JSON.parse(JSON.stringify(data));
    res.status(200).json({result: values});
  } catch(error) {
		console.log("There was an error: ", error);
    const errorMessage = JSON.parse(JSON.stringify(error.message));
    res.status(400).json({error: errorMessage});
  }
});

module.exports = router;