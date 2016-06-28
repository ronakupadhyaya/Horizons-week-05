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
// router.use(function(req, res, next){
//   if (!req.user) {
//     res.redirect('/login');
//   } else {
//     return next();
//   }
// });

router.get('/profile', function(req, res) {
  User.find(function(err, users) {
    res.render('profiles', {
      users: users
    });
  });
});

router.post('/profile/:id/follow', function(req, res) {
  req.user.follow(req.params.id, function(err) {
    res.redirect('/profile/' + req.params.id);
  });
});

router.get('/profile/:id', function(req,res) {
  User.findById(req.params.id, function(err, users) {
    User.getFollowers(function(usersImFollowing, usersWhoFollowMe) {
      var amIAlreadyFollowing = followers.filter(function(follow) {
        return follow.from._id !== req.user._id;
      }).length > 0;
      res.render('singleProfile', {
        users: users,
        following: usersImFollowing,
        followers: usersWhoFollowMe,
        amIAlreadyFollowing: amIAlreadyFollowing
      });
    });
  });
});

module.exports = router;