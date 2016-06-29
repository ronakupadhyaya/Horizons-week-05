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

router.get('/profile', function(req, res,  next) {
  User.findById(req.user._id, function(err, user) {
    if (err) return next(err);
    User.getFollows(req.user._id, function(err, followers, following) {
      if (err) return next(err)
      req.user.isFollowing(user._id, function(err, isFollowing) {
        if (err) return next(err);
        console.log("isFollowing:", isFollowing);
        res.render('singleProfile', {
        user: user,
        followers: followers,
        following: following,
        isFollowing: isFollowing
        })
      });
    })
  })
})

router.get('/profile/:id', function(req, res, next) {
  User.findById(req.params.id, function(err, user) {
    if (err) return next(err);
    User.getFollows(user._id, function(err, followers, following) {
      if (err) return next(err);
      req.user.isFollowing(user._id, function(isFollowing) {
        console.log("isFollowing:", isFollowing);
        res.render('singleProfile', {
        user: user,
        followers: followers,
        following: following,
        isFollowing: isFollowing
        })
      });
    })
  })
})

router.get('/', function(req, res, next) {
  User.find(function(err, users) {
    res.render('profiles', {
      users: users
    })
  })
})

router.post('/follow/:id', function(req, res, next) {
  req.user.follow(req.params.id);
  res.redirect('/profile/' + req.params.id)
})

router.post('/unfollow/:id', function(req, res, next) {
  // req.user.unfollow(req.params.id);
  // res.redirect('/profile/' + req.params.id)
})

router.post('/restaurants/new', function(req, res, next) {

  // Geocoding - uncomment these lines when the README prompts you to!
  // geocoder.geocode(req.body.address, function(err, data) {
  //   console.log(err);
  //   console.log(data);
  // });
  
});

module.exports = router;