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

router.get('/', function(req, res, next){
  res.render('singleProfile');//fix it
})

router.get('/user/:id', function(req, res, next){
  User.findById(req.params.id, function(error, user){
    user.getFollows(function(err, followers, following){
      res.render('singleProfile',{user: user, followers: followers, following: following});
    })
  })
})

router.post('/unfollow/:id', function(req, res, next){
User.findById(req.params.id, function(error, user){
  user.unfollow(req.user.id, function(err){
    if(err){
      return next(err);
      res.redirect('profile');
    }
  });
  res.rerender('singleProfile');
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