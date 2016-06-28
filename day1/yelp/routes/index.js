var express = require('express');
var router = express.Router();
var models = require('../models/models');
var User = models.User;
var Follow = models.Follow;
var Restaurant = models.Restaurant;
var Review = models.Review;

var NodeGeocoder = require('node-geocoder');
var geocoder = NodeGeocoder({
  provider: "google",
  apiKey: process.env.GEOCODING_API_KEY || "AIzaSyA-GcHv9qx1ep9lfoCSMvOk5FGr2GBUVAE",
  httpAdapter: "https",
  formatter: null
});

// THE WALL - anything routes below this are protected!
router.use(function(req, res, next){
  if (!req.user) {
    console.log("help")
    res.redirect('/login');
  } else {
    next();
  }
});

router.get('/', function(req, res, next) {
  res.render('singleProfile', {
    user: req.user
  });
})


router.get('/restaurants/new', function(req, res, next) {
    res.render('newRestaurant');
  })

router.post('/restaurants/new', function(req, res, next){

  geocoder.geocode(req.body.location, function(err, data) {
    console.log(err);
    console.log(data);
    var rest = new Restaurant({
      name: req.body.name,
      category: req.body.category,
      price: req.body.price,
      openTime: req.body.openTime,
      closingTime: req.body.closingTime,
      location: {
        latitude: data[0].latitude,
        longitude: data[0].latitude
      }
    })
    rest.save(function(err, r) {
      console.log(err);
      console.log(r)
      res.redirect('/restaurants/new')
    })
  })
})

  
router.get('/restaurants', function(req, res){
  Restaurant.find(function(err, restaurants) {
    res.render('restaurants', {
      restaurants: restaurants
    })
  })
})

router.get('/restaurants/:id', function(req, res) {
  Restaurant.findById(req.params.id, function(err, rest) {
    res.render('singleRestaurant', {
      restaurant: rest
    })
  })
})

router.get('/profiles', function(req,res) {
  User.find(function(err, user) {
    if (err) {
      res.status(400).send(error);
    }
    res.render('profiles', {
      user: user
    })
  })

});

router.get('/:id'), function(req,res) {
  User.findById(req.params.id, function(err, user) {
    user.getFollowers(this._id, function(err, myFollowers, myFollowed) {

    })
    res.render('singleProfile', {
      user: user
    })
  })

}


module.exports = router;