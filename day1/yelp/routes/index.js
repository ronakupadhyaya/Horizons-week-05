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

router.get('/profiles/:id', function(req,res){
  User.findById(req.params.id, function(err,user){
    user.getFollows(function(followers,followings){
      res.render('singleProfile', {user: user, allFollowers: followers, allFollowings: followings})
    })
  })
})

router.get('/profiles', function(req,res){
  User.find({_id:{$ne: req.user.id}},function(err,users){
    if(err) console.log(err);
    else {
      res.render('profiles', {users:users})
    }
  })
})

router.get('/profiles/:id/follow', function(req,res){
  req.user.follow(req.params.id, function(err){
    if(err) console.log(err);
    else {
      res.redirect('/profiles')
    }
  })
})

router.get('/profiles/:id/unfollow', function(req,res){
  req.user.unfollow(req.params.id, function(err){
    if(err) console.log(err);
    else {
      res.redirect('/profiles')
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
