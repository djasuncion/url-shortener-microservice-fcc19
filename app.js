const dns = require("dns");
const url = require("url");
const shortid = require("shortid");

const express = require("express");
const app = express();
const router = express.Router();

const mongoose = require("mongoose");
mongoose.connect(process.env.SECRET, {
  useNewUrlParser: true,
  useUnifiedTopology: true
});
const Schema = mongoose.Schema;

const db = mongoose.connection;
db.on("error", console.error.bind(console, "connection error:"));
db.once("open", () => {
  console.log("Connected to Mongoose!");
});

//mongoose urlSchema
const urlSchema = new Schema({
  url: {
    type: String,
    require: true
  },
  shortUrl: {
    type: String
  }
});

//mongoose url Model
const Url = mongoose.model("Url", urlSchema);

//mongoose add data

//express routes
router.get("/", function(req, res) {
  res.sendFile(process.cwd() + "/views/index.html");
});

router.post("/api/shorturl/new", (req, res) => {
  const parsedUrl = url.parse(req.body.url);
  const hostname = parsedUrl.hostname;

  dns.lookup(hostname, (err, addresses, family) => {
    if (err) {
      res.json({ error: err.code });
      return console.error(err.code);
    }
    
    const newShortId = shortid.generate();
    const testData = new Url({ url: hostname, shortUrl: newShortId });

    testData.save((err, data) => {
      if (err) return console.error(err);
      console.log("saved");
    });
    
    
   
      res.json({
        newUrl: `https://url-shortener-fcc19.glitch.me/${newShortId}`
      });
    });
  });


router.get("/:shortUrl", (req, res) => {
  
  Url.findOne({ shortUrl: req.params.shortUrl }, (err, doc) => {
    const param = req.params.shortUrl;

    if (err) return console.error(err);
  
    res.redirect(`http://${doc.url}`)


  });
});

// your first API endpoint...
router.get("/api/hello", function(req, res) {
  res.json({ greeting: "hello API" });
});

module.exports = router;
