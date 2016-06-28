var express = require('express');
var router = express.Router();
var models = require('../models/models');
var User = models.User;
var Follow = models.Follow;
var Restaurant = models.Restaurant;
var Review = models.Review;

// Geocoding - uncomment these lines when the README prompts you to!
// var NodeGeocoder = require('node-geocoder');
// var geocoder = NodeGeocoder({
//   provider: "google",
//   apiKey: process.env.GEOCODING_API_KEY || "AIzaSyAf_J5aGnnt8ydIBfAmTmPJ34Jt4H6uJFA",
//   httpAdapter: "https",
//   formatter: null
// });

// THE WALL - anything routes below this are protected!
router.use(function(req, res, next){
  if (!req.user) {
    res.redirect('/login');
  } else {
    return next();
  }
});



router.get('/profiles/:id', function(req, res, next) {
  User.findById(req.params.id, function(err, user) {
    user.getFollowers(function(err, followers, following) {
      res.render('singleProfile', {
        user: user,
        following: following,
        followers: followers
      })
    })
  })
})

router.get('/profiles', function(req, res, next) {
  User.find(function(err, users) {
    console.log(users);
    if (err) return next(err);
    res.render('profiles', {
      users: users 
    });
  });
})

// don't have buttons for follow and unfollow still
router.post('/follow/:id', function(req, res, next) {
  User.follow(req.user.id, req.params.id, function(err) {
    if (err) return next(err);
    res.redirect('/singleProfile');
  })
})

router.post('/unfollow/:id', function(req, res, next) {
  User.unfollow(req.user.id, req.params.id, function(err) {
    if (err) return next(err);
    res.redirect('/singleProfile');
  })
})

router.get('/restaurants', function(req, res, next) {
  Restaurant.find(function(err, restaurants) {
    if (err) return next(err);
    res.render('restaurants', {
      restaurants: restaurants
    })
  })
})

router.get('/restaurants/:id', function(req, res, next) {
  Restaurant.findById(req.params.id, function(err, restaurants) {
      res.render('singleRestaurant', {
        restaurants: restaurants,
      })
  })
})

router.get('/restaurant/new', function(req, res, next) {
  res.render('newRestaurant');
});

router.post('/restaurant/new', function(req, res, next) {
   // Geocoding - uncomment these lines when the README prompts you to!
  // geocoder.geocode(req.body.address, function(err, data) {
  //   console.log(err);
  //   console.log(data);
  // });
  
  var restaurant = new Restaurant({
    name: req.body.name,
    category: req.body.category,
    price: req.body.price,
    openTime: req.body.openTime,
    closeTime: req.body.closeTime,
  });
  restaurant.save(function(err) {
    console.log(err);
    if (err) return next(err);
    res.redirect('/restaurants');
  })
});

module.exports = router;