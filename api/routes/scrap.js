var express = require('express');
var router = express.Router();
const startBrowser = require('../services/browser');
const pageScraper = require('../services/pageScraper');

// Middleware for JSON
router.use(express.json());

// Searches an anime/manga/character/people/company
router.get("/:type/search", function (req, res) {
  // Get type from URL params
  let type = req.params.type || null;
  if(!type){
    res.status(400).json({error: "No type provided"});
  }

  let searchQuery = req.query.query || '';
  let currentPage = req.query.page || 0;
  
  //Start the browser and create a browser instance
  startBrowser().then(function (browser) {
    pageScraper.search(browser, type, searchQuery, currentPage).then(function (data){
      var values = JSON.parse(JSON.stringify(data));
      res.status(200).json({result: values});
    }).catch(function (error) {
      console.log("There was an error (1) => ", error);
      var errorMessage = JSON.parse(JSON.stringify(error.message));
      res.status(400).json({error: errorMessage});
    }).finally(() => {
      browser.close();
    });
  }).catch(function (error) {
		console.log("There was an error (2) => ", error);
    var errorMessage = JSON.parse(JSON.stringify(error.message));
    res.status(400).json({error: errorMessage});
  });
});

module.exports = router;