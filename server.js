"use strict";

var express = require("express");
var mongo = require("mongodb");
var mongoose = require("mongoose");
const router = require("./app");
var cors = require("cors");

var app = express();

// Basic Configuration
var port = process.env.PORT || 3000;

/** this project needs a db !! **/

// mongoose.connect(process.env.MONGOLAB_URI);

app.use(cors());

/** this project needs to parse POST bodies **/
// you should mount the body-parser here

app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.use("/", router);



app.use("/public", express.static(process.cwd() + "/public"));

app.get("/", function(req, res) {
  res.sendFile(process.cwd() + "/views/index.html");
});

// your first API endpoint...
app.get("/api/hello", function(req, res) {
  res.json({ greeting: "hello API" });
});

app.listen(port, function() {
  console.log("Node.js listening ...");
});
