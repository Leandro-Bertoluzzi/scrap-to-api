var express = require('express');
var router = express.Router();
const browserObject = require('../services/browser');
const scraperController = require('../services/scraperController');

// Middleware for JSON
router.use(express.json());

// Get all elements with tag
router.get("/get/all/:tag", function (req, res) {
    // Get tag from URL params
    let tag = req.params.tag;
    //Start the browser and create a browser instance
    let browserInstance = browserObject.startBrowser();
    // Pass the browser instance to the scraper controller
    scraperController(browserInstance, tag).then(function (data) {
      var values = JSON.parse(JSON.stringify(data));
      res.status(200).json(values);
    }).catch(function (error) {
      var errorMessage = JSON.parse(JSON.stringify(error));
      res.status(400).json({error: errorMessage});
    });
  });

module.exports = router;