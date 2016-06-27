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
//   User.findById(req.params.id, function(err, person){
//     if(err){
//       console.log(err);
//       return;
//     }
//     else{
//     req.user.getFollows(person._id, function(err,obj){

//     res.render('singleProfile',{
//     user: {
//       _id: person._id,
//       displayName: person.displayName,
//       email: person.email,
//       location: person.location
//     },
//     reviews: [],
//     allFollowers: obj.followers,
//     allFollowing: obj.following,
//     isFollowing: req.user.isFollowing(person._id,function(err,ret){
//       return ret.status
//     })
//   });
//   });
//   };
// });
router.get('/profile/:id',function(req,res){
  User.findById(req.params.id,function(err,user){
    user.getFollows(function(following,followers){
      followers.filter(function(users){
        //check if im in the list of followers
        return from._id===req.user._id;
      }).length>0;
      }
      res.render('singleProfile',{
        user: user,
        following: usersImFollowing,
        followers: usersWhoFollowMe
      })
    })
  })
})
});

router.post('/profile/:id/follow', function(req,res){
  // res.redirect('/singleProfile/'+req.params.id)
  req.user.follow(req.params.id, function(){
    res.redirect('/singleProfile'+req.params.id)
  })
})



// router.post('/unfollow/:id', function(req,res){
//   console.log('unfollow')
//   // req.user.unfollow(req.params.id, function(err,follows){
//   //   console.log('func unfollow')
//   //   res.render('/singleProfile/'+req.params.id)
//   // });
// });

// router.post('/follow/:id', function(){
//   console.log('follow')
//   //   req.user.follow(req.params.id, function(err,follows){
//   //     consle.log('func follow')
//   //   res.render('/singleProfile/'+req.params.id)
//   // });
// });


module.exports = router;