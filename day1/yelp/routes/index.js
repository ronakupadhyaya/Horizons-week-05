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
  apiKey: process.env.GEOCODING_API_KEY || "AIzaSyC1XuwbLnGVoxrozcTM1Xkpu728xBjM4O8",
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

router.get('/singleProfile/:id', function(req, res){
  User.findById(req.params.id, function(err, user){
    if(err){
      return res.status(400).render('error', {
        message: err
      });
    }
    user.getFollowers(function(followers, followings) {
      res.render('singleProfile', {
        user: user,
        allFollowers: followers,
        allFollowings: followings
      })
    })
  });
});

router.get('/profiles', function(req, res){
  res.render('profile');
});

router.post('/follow/:id', function(req, res){
  req.user.follow(req.params.id, function(error){
    if (error) {
      return res.status(400).render('error', {
        message: error
      });
    } else {
      res.redirect('/singleProfile/' + req.params.id);
    }
  });
});

router.post('/unfollow/:id', function(req, res){
  req.user.unfollow(req.params.id, function(error){
    if (error) {
      return res.status(400).render('error', {
        message: error
      });
    } else {
      res.redirect('/singleProfile/' + req.params.id);
    }
  });
});

router.get('/restaurants', function(req, res, next){
  Restaurant.find(function(error, restaurants){
    if (error) {
      return res.status(400).render('error', {
        message: error
      });
    }
    res.render('restaurants', {
      restaurants: restaurants
    });
  })
});

router.get('/restaurants/new', function(req, res, next){
  res.render('newRestaurant');
});

router.post('/restaurants/new', function(req, res, next) {

  // Geocoding - uncomment these lines when the README prompts you to!
  geocoder.geocode(req.body.address, function(err1, data) {
    //error check
    var r = new Restaurant({
      name: req.body.name,
      category: req.body.category,
      latitude: data[0].latitude,
      longitude: data[0].longitude,
      price: req.body.price,
      opentime: parseInt(req.body.opentime),
      closetime: parseInt(req.body.closetime)
    }).save(function(err2, user){
        if(err2){
          return res.status(400).render('error', {
          message: error
        });
      }
      res.redirect('/restaurants');
    })
  });
});

router.get('/restaurants/:id', function(req, res, next){
  Restaurant.findById(req.params.id, function(error, restaurant){
    if(error){
          return res.status(400).render('error', {
          message: error
        });
    }
    res.render('singleRestaurant', {
      restaurant: restaurant
    });
  });
});

module.exports = router;