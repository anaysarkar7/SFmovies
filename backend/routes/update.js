var express = require("express");
var router = express.Router();
var Data = require("../demoData.json");
// var ACCESS_TOKEN = "XRvs3nwxsk5Ewy6CIteLlTwBPNcEcAXz";
const https = require("https");
const API_LINK = "https://data.sfgov.org/resource/yitu-d5am.json";

const NodeGeocoder = require("node-geocoder");
const options = {
  provider: "mapquest",
  apiKey: "yGKKBRGiLav3G6hR",
  formatter: null,
};
var geocoder = NodeGeocoder(options);

const callback = (resp) => {
  let body = "";
  resp.on("data", (chunk) => {
    body += chunk;
  });
  resp.on("end", () => {
    Data = JSON.parse(body);
  });
  router.get("/update", (req, res) => {
    const seen = new Set();
    const updatedData = Data.filter((el) => {
      const duplicate = seen.has(el.locations);
      seen.add(el.locations);
      return !duplicate;
    });
    // const dataWithLatLng = updatedData.map((obj) => {
    //   geocoder
    //     .geocode(obj.locations)
    //     .then(function (res) {}) // set Lat and Lng
    //     .catch(function (err) {
    //       console.log(err);  
    //     });
    // });
    res.send(updatedData);
  });
};
// geocoder
//   .geocode("29 champs elysée paris")
//   .then(function (res) {
//     console.log(res);
//   })
//   .catch(function (err) {
//     console.log(err);
//   });
https.get(API_LINK, callback).end();

module.exports = router;
