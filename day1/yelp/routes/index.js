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

router.get('/', function(req, res){
  res.redirect('/restaurants');
});

router.get('/profile', function(req, res) {
  var user = req.user;
  user.getFollowers(function(following, followers) {
    user.getReviews(function(reviews) {
      res.render('singleProfile', {
      user: user,
      reviews: reviews,
      following: following,
      followers: followers
    });
    });
  });
});

router.get('/user/:id', function(req, res) {
  var userId = req.params.id;

  User.findById(userId, function(err, user) {
    user.getFollowers(function(following, followers) {
      res.render('singleProfile', {
        user: user,
        review: user.getReviews,
        following: following,
        followers: followers
      });
    });
  });
});

router.get('/users', function(req, res) {
  User.find(function(err, users) {
    if(!err) {
      res.render('profiles', {users: users});
    }
  });
});

router.get('/follow/:id', function(req, res) {
  req.user.follow(req.params.id, function() {});
  res.redirect('/profile');
});

router.get('/unfollow/:id', function(req, res) {
  req.user.unfollow(req.params.id, function() {});
  res.redirect('/profile');
});

router.get('/restaurants', function(req, res) {
  Restaurant.find(function(err, restaurants) {
    console.log(restaurants);
    res.render('restaurants', {restaurants: restaurants});
  });
});

router.get('/restaurants/new', function(req, res) {

  res.render('newRestaurant');
});

router.post('/restaurants/new', function(req, res, next) {

  // Geocoding - uncomment these lines when the README prompts you to!
  // geocoder.geocode(req.body.address, function(err, data) {
  //   console.log(err);
  //   console.log(data);
  // });

  var newRes = new Restaurant({
    name: req.body.name,
    price: req.body.price,
    category: req.body.category,
    latitude: req.body.latitude,
    longitude: req.body.longitude,
    openTime: req.body.openTime,
    closingTime: req.body.closingTime
  });

  newRes.save(function(err) {
    if(!err) {
      console.log('created new restaurant');
    } else {
      console.log(err);
    }
    res.redirect('/restaurants');
  });
});

router.get('/reviews/new/:id', function(req, res) {
  res.render('newReview');
});

router.post('/reviews/new/:id', function(req, res) {
  var newReview = new Review({
    stars: req.body.stars,
    content: req.body.review,
    restaurant: req.params.id,
    user: req.user._id
  });

  newReview.save(function(err) {
    if(err) {
      console.log(err);
    }
  })
  res.redirect('/profile');
});




module.exports = router;






