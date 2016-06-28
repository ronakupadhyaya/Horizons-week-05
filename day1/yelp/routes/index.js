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
  apiKey: process.env.GEOCODING_API_KEY || "AIzaSyCQzvJvemmqRZx83MR4w_7-Os1ywxYku2U",
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


router.get('/profile', function(req,res){
  User.find(function(err, users){
      res.render('profiles', {
        "users": users
      });
    });
});

router.get('/profile/:id', function(req, res){
  User.findById(req.params.id, function(err, user){
    user.getFollows(function(usersImFollowing, usersWhoFollowMe){
      //check if i am in the list of followers currently
      var amIAlreadyFollowing = usersWhoFollowMe.filter(function(follow) {
        return usersImFollowing._id !== req.user._id;
      }).length > 0;
      res.render('singleProfile', {
          user: user,
          following: usersImFollowing,
          followers: usersWhoFollowMe
      });
    });
  });
});

router.post('/profile/:id/follow', function(req, res, next){
  req.user.follow(req.params.id, function(err){
    if(err) { return next(err); }
    res.redirect('/profile/'+req.params.id);
  });
});

router.post('/profile/:id/unfollow', function(req, res, next){
  req.user.unfollow(req.params.id, function(err){
    if(err) { return next(err); }
    res.redirect('/profile/'+req.params.id);
  });
});

router.get('/restaurant/new', function(req, res){
  res.render('newRestaurant');
});

router.post('/restaurant/new', function(req, res, next) {
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
          latitude: data.latitude,
          longitude: data.longitude
      }
  });
  rest.save(function(err,r){
    console.log(err);
      console.log(r);
      res.redirect('/restaurant/new')
  });

});
});

  router.get('/restaurants', function(req, res){
    var page = parseInt(req.query.page || 1);
    Restaurant.find()
      .limit(20)
      .skip(10*(page-1))
      .exec(function(err,restaurants){
        console.log(restaurants)
        res.render('restaurants', {
            restaurants: restaurants})

        });
    });


  router.get('/restaurants/:id', function(req, res){
    console.log("here");
    Restaurant.findById( req.params.id, function(err, rest) {
      console.log("got Restaurant");
      rest.getReviews(function(reviews) {
        console.log("got reviews");
        res.render('singleRestaurant', {
            restaurants: rest,
            reviews: reviews
          });
        });
    });
  });



module.exports = router;
