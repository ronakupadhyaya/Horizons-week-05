var express = require('express');
var router = express.Router();
var models = require('../models/models');
var User = models.User;
var Follow = models.Follow;
var Restaurant = models.Restaurant;
var Review = models.Review;

Geocoding - uncomment these lines when the README prompts you to!
var NodeGeocoder = require('node-geocoder');
var geocoder = NodeGeocoder({
  provider: "google",
  apiKey: process.env.GEOCODING_API_KEY || "AIzaSyDFAwXPd6aq0koZXGAkO0E4ibl1uX7wnTE",
  httpAdapter: "https",
  formatter: null
});

// THE WALL - anything routes below this are protected!
router.use(function(req, res, next){
  if (!req.user) {
    res.redirect('/login');
  } else {
    return next();
  }
});

router.post('/restaurant/new', function(req, res, next) {
  
 geocoder.geocode(req.body.address, function(err,data){ 
  var rest = new Restaurant({
    name: req.body.name,
    category: req.body.category,
    price: req.body.price,
    openTime: req.body.openTime,
    closeTime: req.body.closeTime,
    location: {
      latitude: data.latitude,
      longitude: data.longitude
      }
    });
  });

 rest.save(function (err,r){
   console.log(r);
   res.redirect('/restaurant/new')
 });
});
  // Geocoding - uncomment these lines when the README prompts you to!
  // geocoder.geocode(req.body.address, function(err, data) {
  //   console.log(err);
  //   console.log(data);
  // });

router.get('/restaurants', function(req,res){
  Restaurant.find(function(err,restaurants){
    res.render('restaurants', {
      restaurants: restaurants
    })
  })
})

router.get('/restaurant/new', function(req,res){
  res.render("newRestaurant");
})

router.get('/restaurants/:id' function(req,res){
  Restaurant.findById(req.params.id, function(err,restaurant){
    res.render('singleRestaurant'{
      restaurant: restaurant
    });
  });
});

router.post()


module.exports = router;