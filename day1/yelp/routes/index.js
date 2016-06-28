var express = require('express');
var router = express.Router();
var models = require('../models/models');
var User = models.User;
var Follow = models.Follow;
var Restaurant = models.Restaurant;
var Review = models.Review;

router.get('/profile', function(req, res) {
  User.find(function(err, users) {
    res.render('profiles', {
      users: users
    });
  });
});

router.post('/profile/:id/follow', function(req, res) {
  req.user.follow(req.params.id, function() {
    res.redirect('/profile/' + req.params.id);
  });
});

router.get('/profile/:id', function(req, res) {
  User.findById(req.params.id, function(err, user) {
    user.getFollows(function(following, followers) {
      // Check if I'm in the list of followers
      var amIAlreadyFollowing = followers.filter(function(follow) {
        return follow.from._id !== req.user._id;
      }).length > 0;
      res.render('singleProfile', {
        user: user,
        following: following,
        followers: followers,
        amIAlreadyFollowing: amIAlreadyFollowing
      });
    });
  });
});

router.get('/restaurant/new', function(req, res) {
  res.render('newRestaurant');
})

var NodeGeocoder = require('node-geocoder');
var geocoder = NodeGeocoder({
  provider: "google",
  apiKey: process.env.GEOCODING_API_KEY ||"AIzaSyAx0BDtke8HjGsa3kVcuW2Bju_foD949kM",
  httpAdapter: "https",
  formatter: null
});

router.post('/restaurant/new', function(req, res) {
  geocoder.geocode(req.body.location, function(err, data) {
    var rest = new Restaurant({
      name: req.body.name,
      category: req.body.category,
      price: req.body.price,
      openTime: req.body.openTime,
      closingTime: req.body.closingTime,
      location: {
        latitude: data.latitude,
        longitude: data.longitude
      }
    })

    rest.save(function(err, r) {
      console.log(err);
      res.redirect('/restaurants')
    })
  })
})

router.get('/restaurants', function(req, res) {
  Restaurant.find(function(err, restaurants) {
    res.render('restaurants', {
      restaurants: restaurants
    })
  })
})
// router.post('/loc', function(req, res) {
//   geocoder.geocode(req.body.address, function(err, data) {
//     res.
//     res.send(data);
//   })
// })

module.exports = router;