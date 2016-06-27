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

//get singleProfile
router.get('/profile/:id', function(req, res, next){
  User.findById(req.params.id, function(err, user){
    user.getFollowers(function(err, following, followers){
      var amIAlreadyFollowing= followers.filter(function(follow){
        return follow.from._id === req.user._id;
      }).length>0;
        res.render('singleProfile', {
          user: user,
          following: allFollowing,
          followers: allFollowers,
          amIAlreadyFollowing: amIAlreadyFollowing
        });
      })
    })
  })

router.get('/profile', function(req, res){
  User.find(function(err, users){
    res.render('profiles',{
      users:users
    });
  });
});

router.post('/profile/:id/follow', function(req, res){
  req.user.follow(req.params.id, function(){
    res.redirect('/profile/'+ req.params.id);
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
