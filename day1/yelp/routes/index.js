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
//   apiKey: process.env.GEOCODING_API_KEY || "YOUR KEY HERE",
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

router.get('/users/:id', function(req, res, next){
  var id = req.params.id;
  User.findById(id, function(err, user) {
    User.getFollowers(id, function(err, followers, following) {
      User.isFollowing(req.user._id, function(err, isFollowing){
        res.render('singleProfile', {
        user: user,
        followers: followers,
        following: following,
        isFollowing: isFollowing
        });
      });
    });
  });
});

router.get('/users', function(req, res, next){
  User.find(function(err, users){
    res.render('profiles', {
      users: users
    });
  });
});

router.post('/restaurants/new', function(req, res, next) {

  // Geocoding - uncomment these lines when the README prompts you to!
  // geocoder.geocode(req.body.address, function(err, data) {
  //   console.log(err);
  //   console.log(data);
  // });
  
});

module.exports = router;