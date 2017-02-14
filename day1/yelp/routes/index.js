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
  apiKey: process.env.GEOCODING_API_KEY || "AIzaSyDejcXi6HkumEQ9QGLoFy2olsD3jwz2GLk",
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

router.get('/users/:_id', function(req,res){

  User.findById(req.params._id, function(err,user){
    user.getFollows(function(allFollowers, allFollowing){
      // console.log('rendering' + user);
      // console.log(allFollowers);
      // console.log(allFollowing);
      req.user.isFollowing(req.params._id, function(bool){
        res.render('singleProfile', {
          user: user,
          following: allFollowing,
          followers: allFollowers,
          isFollowing: bool
        })
      })
    })
  })
})

router.post('/users/:_id', function(req, res){
  req.user.isFollowing(req.params._id, function(bool){
    if(bool){
      req.user.unfollow(req.params._id, function(err){
        if (err) {
          res.status(500).json(err);
        } else {
          res.redirect('/users/'+req.params._id)
        }
      })
    } else {
      req.user.follow(req.params._id, function(err){
        if (err){
          res.status(500).json(err);
        } else {
          res.redirect('/users/'+req.params._id);
        }
      })
    }
  })
})


router.get('/users', function(req, res){
  User.find(function(err, users){
    res.render('profiles', {
      users: users
    })
  })

})

router.get('/restaurants', function(req, res) {
  Restaurant.find(function(err, restaurants) {
    if (err) {
      res.sendStatus(400)
    } else {
      res.render('restaurants', {
        restaurant: restaurants
      })
    }
  })
})


router.get('/restaurants/new', function(req, res) {
  res.render('newRestaurant');
})

router.post('/restaurants/new', function(req, res, next) {
  // Geocoding - uncomment these lines when the README prompts you to!
  geocoder.geocode(req.body.address, function(err, data) {
    console.log('Error:')
    console.log(err);
    console.log('Data:')
    console.log(data);
    var restaurant = new Restaurant({
      name: req.body.displayName,
      category: req.body.category,
      latitude: data[0].latitude,
      longitude: data[0].longtitude,
      price: req.body.price,
      open: req.body.open,
      close: req.body.close,
      address: req.body.address
    })
    restaurant.save(function(err) {
      if (err) {
        res.sendStatus(400);
      } else {
        res.redirect('/restaurants');
      }
    })
  });


});


router.get('/restaurants/:_id', function(req,res){
  Restaurant.findById(req.params._id, function(err, restaurant){
    if (err) {
      res.sendStatus(400);
    } else if (restaurant) {
      console.log("no restaurant");
    }
    var hours = restaurant.open + 'AM - ' + restaurant.close + 'PM';

    geocoder.geocode(restaurant.address, function(err, data) {
      console.log('Error:')
      console.log(err);
      console.log('Data:')
      console.log(data);

      res.render('singleRestaurant', {
        name: restaurant.name,
        price: restaurant.price,
        hours: hours,
        latitide: data[0].latitude,
        longtitude: data[0].longtitude
      })
    })
  });

})






module.exports = router;
