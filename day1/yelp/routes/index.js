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

router.get('/users', function(req, res, next){
  User.find(function(err, users){
    res.render('profiles', {
      users:users
    })
  })
});

router.post('/unfollow/:id', function(req, res, next){
  var id = req.params.id;
  User.unfollow(id, function(err, removed){
    if(removed){
      res.redirect('/users');
    }
  })
});


router.get('/users/:id', function(req, res, next){
  var id = req.params.id;
  // need user, followers, following
  User.findById(id, function(err, user){
    user.getFollowers(id, function(err, followers, following) {
      req.user.isFollowing(id, function(err, isFollowing){
        res.render('singleProfile', {
          user: user,
          following: following,
          followers: followers,
          isFollowing: isFollowing
        })
      })
    })
  })
});

router.post('/users/:id', function(req, res, next){
  var id = req.params.id;
  if (req.body.followBtn === "follow"){
    req.user.follow(id, function(err, succ){
      if(err){
        res.send(err);
      }
      if(succ){
        res.redirect('/users/'+id);
      }
    });
  } else {
    req.user.unfollow(id, function(err, removed){
      if(err){
        res.send(err);
      }
      if(removed){
        res.redirect('/users/'+id);
      }
    });
  }
});


router.get('/restaurants', function(req, res, next){
  Restaurant.find(function(err, restaurants){
    res.render('restaurants', {
    restaurants: restaurants
  })
  })
})

var NodeGeocoder = require('node-geocoder');
var geocoder = NodeGeocoder({
 provider: "google",
 apiKey: process.env.GEOCODING_API_KEY || "AIzaSyCYR5XqLDG48sPWbdtGh_lQ4lP4f6bBsfg",
 httpAdapter: "https",
 formatter: null
});

router.post('/restaurants/new', function(req, res, next) {
  // Geocoding - uncomment these lines when the README prompts you to!
  geocoder.geocode(req.body.address, function(err, data) {

    var newRestaurant = new Restaurant({
      name: req.body.name,
      category: req.body.category,
      price: req.body.price,
      openTime: req.body.open,
      closingTime: req.body.close,
      location: {
        latitude: data[0].latitude,
        longitude: data[0].longitude
      }
    })

    newRestaurant.save(function(err, rest){
      if (err){
        console.log(err);
      }
      if(rest){
        console.log(rest);
        res.redirect('/restaurants');
      }
    })
  });
})

router.get('/restaurants/new', function(req, res, next) {
  res.render('newRestaurant');
});

router.get('/restaurants/:id', function(req, res, next){
  Restaurant.findById(req.params.id, function(err, restaraunt){
    res.render('singleRestaurant', {
      restaurant: restaraunt
    })
  })
})

module.exports = router;