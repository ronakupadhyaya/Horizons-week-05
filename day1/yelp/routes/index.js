var express = require('express');
var router = express.Router();
var models = require('../models/models');
var User = models.User;
var Follow = models.Follow;
var Restaurant = models.Restaurant;
var Review = models.Review;

// Geocoding - uncomment these lines when the README prompts you to!
var NodeGeocoder = require('node-geocoder');
var geocoder = NodeGeocoder({
  provider: "google",
  apiKey: process.env.GEOCODING_API_KEY || "AIzaSyAsAvtCsRp8f_-VfuK1PYcOAvpT9ptKR08",
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

router.get('/profile/', function(req, res) {
  User.findById(req.user.id, function(err, user) {
    if (err) res.status(500).send(err);
    user.getFollows(user.id, function(err, followers, following) {
      if (err) res.status(500).send(err);
      res.render('singleProfile', {
        user: user,
        followers: followers,
        following: following
      });
    });
  });
});

router.get('/profile/:id', function(req, res) {
  User.findById(req.params.id, function(err, user) {
    if (err) res.status(500).send(err);
    user.getFollows(user.id, function(err, followers, following) {
      if (err) res.status(500).send(err);
      res.render('singleProfile', {
        user: user,
        followers: followers,
        following: following
      });
    });
  });
});

router.get('/profiles', function(req, res) {
  User.find(function(err, user) {
    res.render('profiles', {
      user: user
    })
  });
});

router.post('/follow/:id', function(req, res, next) {
  User.findById(req.user.id, function(err, user) {
    if (err) return next(err);
    user.follow(req.params.id, function(err) {
      if (err) return next(err);
      res.redirect('/profile');
    });
  });
});

router.post('/unfollow/:id', function(req, res, next) {
  User.findById(req.user.id, function(err, user) {
    user.unfollow(req.params.id, function(err) {
      if (err) return next(err);
      res.redirect('/profile');
    });
  });
});

router.get('/restaurants', function(req, res) {
  Restaurant.find(function(err, restaurant) {
    res.render('restaurants', {
      restaurant: restaurant
    })
  });
});

router.get('/restaurant/:id', function(req, res) {
  Restaurant.findById(req.params.id, function(err, restaurant) {
    res.render('singleRestaurant', {
      restaurant: restaurant
    })
  });
});

router.get('/restaurants/new', function(req, res) {
  res.render('newRestaurant');
});


router.post('/restaurants/new', function(req, res, next) {
  // Geocoding - uncomment these lines when the README prompts you to!
  geocoder.geocode(req.body.newRestaurantAddress, function(err, data) {
    if (err) return next(err);
    var newRestaurant = new Restaurant({
      name: req.body.newRestaurantName,
      category: req.body.newRestaurantCategory,
      latitude: parseFloat(data[0].latitude),
      longitude: parseFloat(data[0].longitude),
      price: parseInt(req.body.newRestaurantPrice),
      openTime: parseInt(req.body.newRestaurantOpenTime),
      closingTime:parseInt(req.body.newRestaurantClosingTime)
    });

    newRestaurant.save(function(err) {
      if (err) return next(err);
      res.redirect('/restaurants')
    })
  });
});

module.exports = router;
