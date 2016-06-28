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
  apiKey: process.env.GEOCODING_API_KEY,
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

router.get('/singleRestaurant/:id', function(req, res, next) {
  var id = req.params.id;
  console.log('test');
  Restaurant.findById(id, function(error, restaurant) {
    if (error) return next(error);
    console.log('im here');
      console.log(restaurant);
      console.log(restaurant.latitude);
      console.log(restaurant.longitude);
    res.render('singleRestaurant', {
      restaurant: restaurant,
      key: process.env.GEOCODING_API_KEY
    });
  })
  
});

router.get('/restaurants/new', function(req, res, next) {
  res.render('newRestaurant');
});


router.post('/restaurants/new', function(req, res, next) {

  // Geocoding - uncomment these lines when the README prompts you to!
  geocoder.geocode(req.body.address, function(err, data) {
    if (err) return next(err);
      console.log(data);
      console.log(data[0].longitude);
      var newRestaurant = new Restaurant({
      name: req.body.name,
      price: req.body.price,
      category: req.body.category,
      address: req.body.address,
      latitude: data[0].latitude,
      longitude: data[0].longitude,
      openTime: req.body.openTime,
      closingTime: req.body.closeTime
      });

      newRestaurant.save(function(error) {
        if (error) return next(error);
        console.log("Success");
      })
      
      res.redirect('/restaurants');

    
  });
  
});

router.get('/restaurants', function(req, res, next) {
  Restaurant.find(function(err, restaurants) {
    if (err) return next(err);
    res.render('restaurants', {
      restaurants: restaurants
    });
  })
  
})

router.get('/profiles', function(req, res, next) {
  User.find(function(error, usersFromMongo) {
    if (error) return next(error);
    res.render('profiles', {
    users: usersFromMongo
  });
  });
  
});

router.post('/singleProfile/:id', function(req, res, next) {
  var idToFollow = req.params.id;
  console.log(req.user);
  req.user.follow(idToFollow, function(result) {
    if (!result) {
      res.send("You are already following");
    }
    else {
      res.send("Congrats you have followed this person");
    }

})
})

router.get('/singleProfile/:id', function(req, res, next) {
  var id = req.params.id;
  User.findById(id, function(error, user) {
    if (error) {
      return next(error);
    }
    user.getFollowers(function(err, followers, following) {
      if (err) return next(err);
      console.log(followers);


      res.render('singleProfile', {
        user: user,
        followers: followers,
        following: following          
      });
    })
  
  })
  
})

router.post('/unfollow/:id', function(req, res, next) {
  var userId

})


module.exports = router;