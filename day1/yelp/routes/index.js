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

router.get('/editProfile', function(req, res) {

});


router.get('/myProfile', function(req,res) {
  var current = req.user;
  var data;
  var d = function(item) {
    data = item;
    return item;
  }
  current.getFollows(d);
  //console.log(data);

  User.find({}, function(err, all) {
    if (err) {
      console.log(err);
    } else {
      res.render('profiles', {
        user: req.user,
        //followers: data.allFollowers,
        //following: data.allFollowing,
        allpeople: all});
    }
  })

})

router.get('/follow/:id', function(req, res) {
  req.user.follow(req.params.id, function(err, data) {
    res.redirect('/myProfile');
  })

})

router.post('/restaurants/new', function(req, res, next) {

  // Geocoding - uncomment these lines when the README prompts you to!
  // geocoder.geocode(req.body.address, function(err, data) {
  //   console.log(err);
  //   console.log(data);
  // });

});

module.exports = router;
