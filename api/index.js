"use strict";

const express = require("express");
const config = require("./config/config");

// Routes
const search = require("./routes/search");
const lists = require("./routes/lists");

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

// Routes
app.use("/search", search);
app.use("/list", lists);

// Validate connection
app.listen(API_PORT, API_HOST, function(){
  console.log(`Server running on http://${API_HOST}:${API_PORT}`);
});
