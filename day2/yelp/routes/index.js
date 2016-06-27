var express = require('express');
var router = express.Router();
var models = require('../models/models');
var User = models.User;
var Follow = models.Follow;
var Restaurant = models.Restaurant;
var Review = models.Review;

// Geocoding
var NodeGeocoder = require('node-geocoder');
var geocoder = NodeGeocoder({
  provider: "google",
  apiKey: process.env.GEOCODING_API_KEY || "YOUR KEY HERE",
  httpAdapter: "https",
  formatter: null
});

router.get('/restaurants/new', function(req, res, next) {
  res.render('editRestaurant');
});

router.post('/restaurants/new', function(req, res, next) {
  // GEOCODE SCAFFOLD HERE
  var ihpAddr = "International House Philadelphia, 3701 Chestnut St, Philadelphia, PA";
  geocoder.geocode(ihpAddr, function(err, data) {
    console.log(err);
    console.log(data);
    res.send(data);
  });
  
});

// THE WALL
router.use(function(req, res, next){
  if (!req.user) {
    res.redirect('/login');
  } else {
    return next();
  }
});

module.exports = router;
