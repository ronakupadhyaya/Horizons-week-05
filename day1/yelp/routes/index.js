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
  apiKey: process.env.GEOCODING_API_KEY || "AIzaSyBUaSB2CQjTbXfTSzGpKhAWCydVBEWuNcc",
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
    })
  })
});


router.get('/user', function(req,res,next){
  User.find(function(err,users){
    if(!err){
      res.render('profiles', {
        users: users
      })
    }
  })
})

router.get('/profile', function(req,res,next){
  User.find(function(err,users,from, to){
    if(!err){
      res.render('profiles', {users: users, from: from, to: to})
    }
  })
})

router.post('/profile/:id/follow', function(req, res, next) {
  //req.user = currently loged in user. empty till you log in.
  //calling the method follow on it, giving it things
  req.user.follow(req.params.id, function(err){
    res.redirect(/profile/ + req.params.id)
  })
  // User.follow(req.user.id, req.params.id, function(err) {
  //   if (err) {
  //     return next(err);
  //   } else (res.redirect('/profile'));
    // TODO: Confirm following
  // });
});

router.post('/unfollow/:id', function(req, res, next) {
  User.unfollow(req.user.id, req.params.id, function(err) {
    if (err) return next(err);
    res.redirect('/profile');
  });
});


router.get('/restaurants/new', function(req, res, next) {
  res.render('newRestaurant');
});



router.post('/loc', function(req,res) {
  geocoder.geocode(req.body.location, function(err,data){
    res.send(data);
  })
})

router.post('/restaurants/new', function(req, res, next) {
  // Geocoding - uncomment these lines when the README prompts you to!


  geocoder.geocode(req.body.location, function(err, data) {
    console.log(err);
    console.log(data);
    console.log(req.body.name);
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
  });

    rest.save(function(err, r){
      if (err) { return next(err) }
      console.log(r);
      res.redirect('/restaurants')
    })
  });
  
});

// router.post('/restaurants/new', function(req, res, next) {

//   var restaurant = new Restaurant({
//     restName: req.body.restName,
//     restOpen: req.body.restOpen,
//     restClose: req.body.restClose
//   });
//   console.log(restaurant)
//   restaurant.save(function(err) {
//     console.log("this is restaurant:" + restaurant)
//     if (err) return next(err);
//     // if (err) {console.log(err)};
//     console.log("you got to " + restaurant)
//     res.redirect('/restaurants');
//   })
// });

router.get('/restaurants', function(req, res, next) {
  models.Restaurant.find(function(err, restaurants) {
    if (err) return next(err);
    console.log("Console logging this" + restaurants)
    res.render('restaurants', {
      restaurants: restaurants
    });
  });
});

module.exports = router;