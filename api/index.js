"use strict";

const express = require("express");
var cors = require('cors');
const config = require("./config/config");

// Constants
const API_PORT = config.API_PORT;
const API_HOST = config.API_HOST;

// Define app
const app = express();

// Middleware for allowing CORS
app.use(cors());

// ******************** API ******************** //

// Home
app.get("/", (req, res) => {
  res.send("Hello World");
});

// Validate connection
app.listen(API_PORT, API_HOST, function(){
  console.log(`Server running on http://${API_HOST}:${API_PORT}`);
});
