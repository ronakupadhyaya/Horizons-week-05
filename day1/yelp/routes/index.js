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
    res.render('profiles', {
      users: users
    })
  }
  }); 
})

router.get('/singleProfile/:id', function(req,res){
  // router.get('/profile/:id',function(req,res){
  User.findById(req.params.id,function(err,user){
   user.getFollows(function(following,followers){
    //   var amIAlreadyFollowing=followers.filter(function(follow){
    //     //check if im in the list of followers
    //     console.log(follow.from._id===req.user._id);
    //     return follow.from._id===req.user._id;
    //   });
    user.isFollowing(req.params.id,function(result){
      res.render('singleProfile',{
        user: user,
        following: following,
        followers: followers,
        amIAlreadyFollowing: result
         })
      })
    })
  })
})


router.post('/profile/:id/follow', function(req,res){
  // res.redirect('/singleProfile/'+req.params.id)
  req.user.follow(req.params.id, function(){
    res.redirect('/singleProfile/'+req.params.id)
  })
})

router.post('/profile/:id/unfollow', function(req,res){
  // res.redirect('/singleProfile/'+req.params.id)
  req.user.unfollow(req.params.id, function(){
    res.redirect('/singleProfile/'+req.params.id)
  })
})





module.exports = router;