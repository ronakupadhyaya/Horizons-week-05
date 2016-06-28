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
  apiKey: process.env.GEOCODING_API_KEY || "AIzaSyBi9V0GScejostPVfZoVI2xlTeRJSSEEHM",
  httpAdapter: "https",
  formatter: null
});

router.post('/restaurant/new', function(req, res, next) {

  // Geocoding - uncomment these lines when the README prompts you to!
  geocoder.geocode(req.body.location, function(err, data) {
    console.log(err);
    console.log(data);
    var r = new Restaurant({
      name: req.body.name,
      category: req.body.category,
      price: req.body.price,
      openTime: req.body.openTime,
      closingTime: req.body.closeTime,
      location: {
        latitude: data[0].latitude,
        longitude: data[0].longitude
      }
    })
    r.save(function(err, restaurant) {
      console.log(err);
      console.log(restaurant);
      res.redirect('/restaurant');
    })
  });
  
});

router.get('/restaurant/new', function(req, res) {
  res.render('newRestaurant');
});

router.get('/restaurants', function(req, res) {
  Restaurant.find(function(error, restaurants) {
    res.render('restaurants', {
      restaurants: restaurants
    })
  })
})

router.get('/restaurant/:id', function(req, res) {
  Restaurant.findById(req.params.id, function(error, restaurant) {
    res.render('singleRestaurant', {
      restaurant: restaurant
    })
  })
})


// THE WALL - anything routes below this are protected!
router.use(function(req, res, next){
  if (!req.user) {
    res.redirect('/login');
  } else {
    return next();
  }
});

router.get('/', function(req, res, next) {
  User.find(function(error, users) {
    if (error) {
      console.log('BIG ERROR');
    }
    res.render('profiles', {
      users: users
    });
  })
})

router.post('/profile/:id/follow', function(req, res, next) {
  req.user.follow(req.params.id, function(err) {
    res.redirect('/profile/'+req.params.id);
  })
})

router.post('/profile/:id/unfollow', function(req, res, next) {
  req.user.unfollow(req.params.id, function(err) {
    res.redirect('/profile/'+req.params.id);
  })
})

router.get('/profile/:id', function(req, res, next) {
  User.findById(req.params.id, function(error, user) {
    user.getFollowers(function(followers, following) {
      console.log(following)
      var amIAlreadyFollowing = followers.filter(function(users) {
        return users.from._id.equals(req.user._id);
      }).length > 0;
      res.render('singleProfile', {
        user: user,
        followers: followers,
        following: following,
        amIAlreadyFollowing: amIAlreadyFollowing
      })
    })
  })
})

module.exports = router;