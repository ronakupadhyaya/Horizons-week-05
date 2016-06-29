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
  apiKey: process.env.GEOCODING_API_KEY || "AIzaSyDp2U6H3ju79vdV2hvccmHr2qOQ6fwQwL8",
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

router.get('/', function(req, res, next){
  User.find().exec(function(error, users){
    res.render('profiles',{users: users, user: req.user});
  });
})

router.get('/user/:id', function(req, res, next){
  User.findById(req.params.id, function(error, user){
    user.getFollows(function(err, followers, following){
      var alreadyFollowing; 
      for(var i = 0; i < followers.length; i++){
        if(followers[i].from._id.equals(req.user.id)){
          alreadyFollowing = true;
          break;
        }
      }
      res.render('singleProfile',{user: user, followers: followers, following: following, alreadyFollowing: alreadyFollowing});
    })
  })
})

router.post('/follow/:id', function(req, res, next){
  console.log(req.user._id);
  req.user.follow(req.user._id, req.params.id, function(err){
    if(err){
      return next(err);
      res.redirect('profile');
    }
  });
  res.redirect('/user/' + req.params.id);
})

router.post('/unfollow/:id', function(req, res, next){
  console.log(req.user._id);
  req.user.unfollow(req.user._id, req.params.id, function(err){
    if(err){
      return next(err);
      res.redirect('profile');
    }
  });
  res.redirect('/user/' + req.params.id);
})

router.get('/restaurants/new', function(req, res){
  res.render('newRestaurant');
})

router.post('/restaurants/new', function(req, res, next) {

  // Geocoding - uncomment these lines when the README prompts you to!
  geocoder.geocode(req.body.location, function(err, data) {
    if(err){
      return res.send("You have done something wrong");
    }
      var rest = new Restaurant({
      name: req.body.name,
      category: req.body.category,
      price: req.body.price,
      openTime: req.body.openTime,
      closeTime: req.body.closeTime,
      location:
      {
        latitude: data[0].latitude,
        longitude: data[0].longitude
      }
    });

    rest.save(function(err, r) {
      console.log(r);
      res.redirect('/restaurants/new');
    })

  });
  
});

router.get('/restaurants', function(req, res, next){
  Restaurant.find().exec(function(err, rests){
    res.render('restaurants', {
      restaurants: rests
    });
  })
})

router.get('/restaurants/:id', function(req, res, next){
  Restaurant.findById(req.params.id).exec(function(err, rest){
    console.log(rest.location.latitude)
    res.render('singleRestaurant', {
      restaurant: rest
    });
  })
})

module.exports = router;