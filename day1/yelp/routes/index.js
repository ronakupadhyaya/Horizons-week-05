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
// router.get('/', function(req,res,next) {
//   console.log(req.user)
//   // placeholder, possible new index page later
//   res.redirect('/user/'+req.user._id)
// })

// ----------------------------------------------
// ROUTES TO USER PAGES
// ----------------------------------------------
router.get('/', function(req,res,next) {
  res.redirect('/user/'+req.user._id)
})
router.get('/user/:id', function(req,res,next) {
  User.findById(req.params.id, function(err,user) {
    user.getFollowers(req.params.id,function(err,followers,following) {
      res.render('user', {
        user:user,
        followers:followers,
        following:following
      })
    })
  })
})
// ----------------------------------------------
// FOLLOW AND UNFOLLOW
// ----------------------------------------------
router.post('/user/:id/:request', function(req,res,next) {
  if (req.params.request==='follow' || req.params.request==='unfollow')
  req.user[req.params.request].call(req.user, req.params.id, function() {return})
})

// ----------------------------------------------
// ROUTE TO PROFILES LIST
// ----------------------------------------------
router.get('/profiles', function(req,res,next) {
  User.find(function(err, users) {
    if (err) {
      res.redirect('/error', {error:err})
    } else {
      res.render('profiles', {users:users})
    }
  })
})

// ----------------------------------------------
// ROUTES TO RESTAURANTS
// ----------------------------------------------
router.post('/restaurants/new', function(req, res, next) {

  // Geocoding - uncomment these lines when the README prompts you to!
  // geocoder.geocode(req.body.address, function(err, data) {
  //   console.log(err);
  //   console.log(data);
  // });
  
});
module.exports = router;