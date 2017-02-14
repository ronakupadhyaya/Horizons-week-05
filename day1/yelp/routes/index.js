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

router.get('/users', function(req, res){
  // var givenID = req.params.id;
  User.find(function(err, users){
    if (err){
      console.log(err);
    }else {
      console.log(users);
      res.render('profiles', {users: users })
    }
  })
})

router.get('/users/:id', function(req, res){
  // console.log(req.user);
  var givenID = req.params.id;
  // req.user.getFollows(function(followers, followees){
  //   res.render('profiles', {followers: followers, followees: followees});
  // })
  console.log(req.user);
  User.findById(givenID, function(err, user){
    if (err){
      console.log(err);
    } else {
      user.getFollows(function(followers, followees){
        res.render('singleProfile', {user: user, followers: followers, followees: followees})
      });
    }
  })
})
router.post('/restaurants/new', function(req, res, next) {

  // Geocoding - uncomment these lines when the README prompts you to!
  // geocoder.geocode(req.body.address, function(err, data) {
  //   console.log(err);
  //   console.log(data);
  // });

});

module.exports = router;
