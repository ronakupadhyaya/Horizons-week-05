var express = require('express');
var router = express.Router();
var models = require('../models/models');
var User = models.User;
var Follow = models.Follow;
var Restaurant = models.Restaurant;
var Review = models.Review;

//USERS
router.get('/users/:id', function(req,res){
 User.findById(req.params.id, function(err,user){
   user.getFollows(function(allFollowers, allFollowing){
     req.user.isFollowing(req.params.id, function(bool){
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


router.get('/users', function(req, res) {
  User.find(function(err, users) {
    if (err) {
      throw "err"
    } else {
      res.render('profiles', {
        users: users
      })
    }
  })
})


router.post('/users/:id', function(req, res){
 req.user.isFollowing(req.params.id, function(bool){
   if(bool){
     req.user.unfollow(req.params.id, function(err){
       if (err) {
         res.status(500).json(err);
       } else {
         res.redirect('/users/'+req.params.id)
       }
     })
   } else {
     req.user.follow(req.params.id, function(err){
       if (err){
         res.status(500).json(err);
       } else {
         res.redirect('/users/'+req.params.id);
       }
     })
   }
 }


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

module.exports = router;
