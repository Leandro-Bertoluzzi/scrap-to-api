"use strict";

const express = require("express");
const config = require("./config/config");
const browserObject = require('./services/browser');
const scraperController = require('./services/pageController');

// Constants
const API_PORT = config.API_PORT;
const API_HOST = config.API_HOST;

// Define app
const app = express();

// ******************** API ******************** //

// Home
app.get("/", (req, res) => {
  res.send("Hello World");
});

// Validate connection
app.listen(API_PORT, API_HOST, function(){
  console.log(`Server running on http://${API_HOST}:${API_PORT}`);

  //Start the browser and create a browser instance
  let browserInstance = browserObject.startBrowser();
  // Pass the browser instance to the scraper controller
  scraperController(browserInstance);
});
