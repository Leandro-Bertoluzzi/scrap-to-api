"use strict";

const express = require("express");
const config = require("./config/config");
const scrap = require("./routes/scrap");

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

app.use("/", scrap);

// Validate connection
app.listen(API_PORT, API_HOST, function(){
  console.log(`Server running on http://${API_HOST}:${API_PORT}`);
});
