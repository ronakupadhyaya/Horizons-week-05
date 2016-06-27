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

router.post('/restaurants/new', function(req, res, next) {

  // Geocoding - uncomment these lines when the README prompts you to!
  // geocoder.geocode(req.body.address, function(err, data) {
  //   console.log(err);
  //   console.log(data);
  // });
  
});

router.get('/profiles', function(req, res, next) {
  User.find(function(error, usersFromMongo) {
    res.render('profiles', {
    users: usersFromMongo
  });
  });
  
});

router.post('/singleProfile/:id', function(req, res, next) {
  var idToFollow = req.params.id;
  console.log(req.user);
  req.user.follow(idToFollow, function(result) {
    if (!result) {
      res.send("You are already following");
    }
    else {
      res.send("Congrats you have followed this person");
    }

})
})

router.get('/singleProfile/:id', function(req, res, next) {
  var id = req.params.id;
  User.findById(id, function(error, user) {
    if (error) {
      return next(error);
    }
    user.getFollowers(function(err, followers, following) {
      if (err) return next(err);
      console.log(followers);
      res.render('singleProfile', {
        user: user,
        followers: followers,
        following: following          
      });
    })
  
  })
  
})

module.exports = router;