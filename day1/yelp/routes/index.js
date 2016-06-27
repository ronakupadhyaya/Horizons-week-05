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
  apiKey: process.env.GEOCODING_API_KEY || "AIzaSyDHY_Z52IV3Et-b4q-KrcOK-6r5FXW4cxw",
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
router.get('/restaurant/:id', function(req,res,next) {
  Restaurant.findById(req.params.id, function(err,food) {
    if (err) {
      res.redirect('/error', {error:err})
    } else {
      res.render('singleRestaurant', {restaurant:food})
    }
  })
})
router.get('/restaurants/new', function(req,res,next) {
  res.render('newRestaurant')
})
router.post('/restaurants/new', function(req, res, next) {
  // Geocoding - uncomment these lines when the README prompts you to!
  geocoder.geocode(req.body.address, function(err, data) {
    console.log(err);
    console.log(data);

    var restaurant = new Restaurant();
    restaurant.name = req.body.name
    restaurant.category = req.body.category
    restaurant.latitude
    restaurant.longitude
    restaurant.price = '$'.repeat(req.body.price)
    restaurant.opentime = req.body.opentime
    restaurant.closingtime = req.body.closingtime
    restaurant.reviewCount = 0

    restaurant.save(function(err) {
      if (err) {
        res.redirect('/error',{error:err})
      } else {
        res.redirect('/restaurants')
      }
    })
  });
});
module.exports = router;