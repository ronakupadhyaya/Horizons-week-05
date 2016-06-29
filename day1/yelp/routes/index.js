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
  apiKey: process.env.GEOCODING_API_KEY || "AIzaSyAXrOcI2vMYurPGdWg1radfOkKuvNVmrZI",
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

router.get('/', function(req, res, next){
  User.find().exec(function(err, users) {
    res.render('profiles', {
      users: users
    });
  });
});

router.get('/user/:id', function(req, res, next){
  User.findById(req.params.id, function(error, user){
    user.getFollows(function(err, followers, following){
      console.log("followers", followers);
      console.log("following", following);
      var isFollowing;
      for (var i=0; i<followers.length; i++) {
        if(followers[i].from._id.equals(req.user.id)) {
          isFollowing = true;
          break;
        }
      }
      res.render('singleProfile',{
        user: user,
        followers: followers,
        following: following,
        isFollowing: isFollowing
      });
    })
  })
});

router.post('/unfollow/:id', function(req, res, next){
  console.log(req.user.id);
  req.user.unfollow(req.params.id, function(err) {
    if (err) return next(err);
    res.redirect('/user/' + req.params.id);
  });
});

router.post('/follow/:id', function(req, res, next) {
  req.user.follow(req.params.id, function(err) {
    if (err) return next(err);
    res.redirect('/user/' + req.params.id);
  });
})

//restaurants

router.get('/restaurants/new', function(req, res) {
  res.render('newRestaurant');
});

router.post('/restaurants/new', function(req, res, next) {
  // Geocoding - uncomment these lines when the README prompts you to!

  geocoder.geocode(req.body.location, function(err, data) {
      var rest = new Restaurant({
      name: req.body.name,
      category: req.body.category,
      price: req.body.price,
      openTime: req.body.openTime,
      closeTime: req.body.closeTime,
      location: {
        latitude: data[0].latitude,
        longitude: data[0].longitude
      }
    });
    rest.save(function(err, r) {
      console.log(r);
      res.redirect('/restaurants/new');
    })
  });

});

router.get('/restaurants', function(req, res) {
    Restaurant.find().exec(function(err, rests) {
    res.render('restaurants', {
      restaurants: rests
    });
  });
});

router.get('/restaurants/:id', function(req, res, next){
  Restaurant.findById(req.params.id, function(error, rest){
    res.render('singleRestaurant', {
      rest: rest
    });
  });
});

module.exports = router;