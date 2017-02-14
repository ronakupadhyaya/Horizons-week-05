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


router.get('/', function(req, res){

  User.find(function(err, users){

    if(err){
      res.status(500).json(err);
    } else{
      res.render('../views/profiles', {users: users});
    }

  });

});



router.get('/singleProfile/:userId', function(req, res){

  var userId = req.params.userId;

  User.findById(req.params.userId, function(err, user1){

    if(err){
      res.status(500).json(err);
    } else{


      user1.getFollows(function(err, followersObj){

        if(err){
          res.status(500).json(err);
        } else{


          res.render('singleProfile', {
            user: user1,
            followObj: followersObj
          });

        }
      });
    }
  });
});

router.post("/followUser/:userId", function(req, res){

  console.log('*********');

  console.log(req.params.userId);
  console.log(req.user);

  console.log('*********');


  var newFollow = new Follow({

    followee: req.params.userId,
    follower: req.user._id

  });

  newFollow.save(function(err, follow){

    if(err){
      res.status(500).json(err);
    } else{
      console.log(follow);
      res.redirect('/');
    }

  });




});

router.post('/restaurants/new', function(req, res, next) {

  // Geocoding - uncomment these lines when the README prompts you to!
  // geocoder.geocode(req.body.address, function(err, data) {
  //   console.log(err);
  //   console.log(data);
  // });
  
});

module.exports = router;