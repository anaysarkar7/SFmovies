var express = require("express");
var router = express.Router();
var Data = require("../demoData.json");

const https = require("https");
const API_LINK = "https://data.sfgov.org/resource/yitu-d5am.json";
const callback = (resp) => {
  let body = "";
  resp.on("data", (chunk) => {
    body += chunk;
  });
  resp.on("end", () => {
    Data = JSON.parse(body);
  });
  router.get("/locations", (req, res) => {
    var arr = [{}];
    Data.map((item, i) => {
      arr[i] = item.locations;
    });
    const seen = new Set();
    const l = arr.filter((el) => {
      const duplicate = seen.has(el);
      seen.add(el);
      return !duplicate;
    });
    res.send(l);
  });
};

https.get(API_LINK, callback).end();

module.exports = router;
