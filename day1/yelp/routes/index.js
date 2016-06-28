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

router.post('/profile/:id/unfollow', function(req, res) {
  req.user.unfollow(req.params.id, function() {
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

router.get('/restaurants/new', function(req, res) {
  res.render('newRestaurant');
})

var NodeGeocoder = require('node-geocoder');
var geocoder = NodeGeocoder({
  provider: "google",
  apiKey: process.env.GEOCODING_API_KEY ||"AIzaSyAx0BDtke8HjGsa3kVcuW2Bju_foD949kM",
  httpAdapter: "https",
  formatter: null
});

router.get('/restaurants/:id', function(req, res) {
  Restaurant.findById(req.params.id, function(err, restaurants) {
    if (err) console.log(err);
    restaurants.getReviews(function(reviews) {
      res.render('singleRestaurant', {
        restaurant: restaurants,
        // name: restaurants.name,
        // openTime: restaurants.openTime,
        // closingTime: restaurants.closingTime,
        // latitude: restaurants.location.latitude,
        // longitude: restaurants.location.longitude,
        token: "AIzaSyAx0BDtke8HjGsa3kVcuW2Bju_foD949kM",
        reviews: reviews
      })
    })
  })
})

router.get('/restaurants/lists/:page', function(req, res) {
  var page=parseInt(req.params.page || 1);
  Restaurant.getTen(req.params.page, function(restaurant) {
    res.render('restaurants', {
      restaurants: restaurant,
      prev: page - 1,
      next: page + 1,
      page: page
    })
  })
})

router.post('/restaurants/:id/reviews', function(req, res, next) {
  var review = new Review({
    content: req.body.content,
    stars: req.body.stars,
    restaurantId: req.params.id,
    userId: req.user._id
  })

  review.save(function(err, succ) {
    if (succ) {
      Restaurant.findByIdAndUpdate(req.params.id, {
      $inc: {totalScore: parseInt(req.body.stars), reviewCount:1} }, function(err, rest) {
        if (rest) {
          res.redirect('/restaurants/' + req.params.id);
        }
      })
    }
    if (err) {
      res.send(err);
    }
  })
})

router.post('/restaurants/new', function(req, res) {
  geocoder.geocode(req.body.location, function(err, data) {
    console.log(data);
    var rest = new Restaurant({
      name: req.body.name,
      category: req.body.category,
      price: req.body.price,
      openTime: req.body.openTime,
      closingTime: req.body.closingTime,
      location: {
        latitude: data[0].latitude,
        longitude: data[0].longitude
      },
      totalScore: 0,
      reviewCount: 0
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