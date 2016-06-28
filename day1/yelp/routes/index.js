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
//   apiKey: process.env.GEOCODING_API_KEY || "AIzaSyAf_J5aGnnt8ydIBfAmTmPJ34Jt4H6uJFA",
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

router.get('/profiles/:id', function(req, res, next) {
  User.findById(req.params.id, function(err, user) {
    user.getFollowers(function(err, followers, following) {
      res.render('singleProfile', {
        user: user,
        following: following,
        followers: followers
      })
    })
  })
})

router.get('/profiles', function(req, res, next) {
  User.find(function(err, users) {
    console.log(users);
    if (err) return next(err);
    res.render('profiles', {
      users: users 
    });
  });
})

// don't have buttons for follow and unfollow still
router.post('/follow/:id', function(req, res, next) {
  User.follow(req.user.id, req.params.id, function(err) {
    if (err) return next(err);
    res.redirect('/singleProfile');
  })
})

router.post('/unfollow/:id', function(req, res, next) {
  User.unfollow(req.user.id, req.params.id, function(err) {
    if (err) return next(err);
    res.redirect('/singleProfile');
  })
})

router.get('/restaurants', function(req, res, next) {
  var list = parseInt(req.query.list || 1);
  Restaurant.find().limit(10).skip(10*(list-1)).sort({name: 1}).exec(function(err, restaurants) {
    if (err) return next(err);
    var arr = [];
    var pageOffset = 10;
    for (var i=list; i < list + pageOffset; i++) {
      arr.push(i); //- Math.floor(pageOffset / 2));
    }
    res.render('restaurants', {
      restaurants: restaurants,
      list: list,
      pageNumber: arr
    })
  })
})

// individual restaurants not showing up
router.get('/restaurants/:id', function(req, res, next) {
  console.log('id', req.params.id);
  Restaurant.findById(req.params.id, function(err, restaurants) {
    console.log(restaurants);
    restaurants.getReviews(req.params.id, function(err, reviews) {
      //console.log(reviews);
      res.render('singleRestaurant', {
        restaurantId: req.params.id,
        restaurants: restaurants,
        reviews: reviews,
       // stars: stars
      })
    })
  })
})

router.get('/restaurant/new', function(req, res, next) {
  res.render('newRestaurant');
});

router.post('/restaurant/new', function(req, res, next) {
   // Geocoding - uncomment these lines when the README prompts you to!
  // geocoder.geocode(req.body.address, function(err, data) {
  //   console.log(err);
  //   console.log(data);
  // });
  
  var restaurant = new Restaurant({
    name: req.body.name,
    category: req.body.category,
    price: req.body.price,
    openTime: req.body.openTime,
    closeTime: req.body.closeTime,
  });
  restaurant.save(function(err) {
    console.log(err);
    if (err) return next(err);
    res.redirect('/restaurants');
  })
});

router.get('/newReview/:id', function(req, res, next) {
  console.log(req.params.id);
  Restaurant.findById(req.params.id, function(err, review) {
    if (err) return next(err);
    res.render('newReview');
  })
})

// not saving new reviews properly
router.post('/newReview/:id', function(req, res, next) {
  var review = new Review({
    content: req.body.content,
    stars: req.body.stars,
    restaurantId: req.params.id,
    userId: req.user.id,
  })
  review.save(function(err) {
    res.redirect('/restaurants/' + req.params.id);
  })
})

module.exports = router;