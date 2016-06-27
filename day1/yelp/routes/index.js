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

router.post('/restaurants/new', function(req, res, next) {

  // Geocoding - uncomment these lines when the README prompts you to!
  // geocoder.geocode(req.body.address, function(err, data) {
  //   console.log(err);
  //   console.log(data);
  // });
  
});

router.get('/', function(req,res){
  res.render('restaurants')
})

router.get('/profiles', function(req,res){
  User.find(function(err,users){
    if(users){
    res.render('profiles', {users})
  }
  }); 
})

router.get('/singleProfile/:id', function(req,res){
  User.findById(req.params.id, function(err, person){
    if(err){
      console.log(err);
      return;
    }
    else{
    req.user.getFollows(person._id,res.render('singleProfile',{
    user: {
      _id: person._id,
      displayName: person.displayName,
      email: person.email,
      location: person.location
    },
    reviews: [],
    allFollowers: this.followers,
    allFollowing: this.following,
    isFollowing: person.isFollowing(req.user.id,function(){
      if(true){
        return true
      }
      else{
        return false
      }
    })
  }));
  };
});
});


module.exports = router;