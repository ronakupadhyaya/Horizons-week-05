var express = require('express');
var router = express.Router();
var models = require('../models/models');
var User = models.User;
var Follow = models.Follow;
var Restaurant = models.Restaurant;
var Review = models.Review;

//RESTAURANTS
router.get('/restaurant/new', function(req,res, next){
  res.render('newRestaurant');
})

// Geocoding - uncomment these lines when the README prompts you to!
var NodeGeocoder = require('node-geocoder');
var geocoder = NodeGeocoder({
  provider: "google",
  apiKey: process.env.GEOCODING_API_KEY || "AIzaSyDGqKYgbJofVu8GkKNnoqve12JXuMc5ASY",
  httpAdapter: "https",
  formatter: null
});

//EXAMPLE OF GEOCODING
// router.get('/loc', function(req,res){
//   geocoder.geocode(req.body.address, function(err, data){
//     console.log(err);
//     res.send(data);
//   })
// })

router.post('/restaurant/new', function(req, res, next) {
  geocoder.geocode(req.body.address, function(err, data) {
    console.log(err);
    console.log(data);
    var rest = new Restaurant({
      name: req.body.name,
      category: req.body.category,
      price: req.body.price,
      openTime: req.body.openTime,
      closingTime: req.body.closeTime,
      location: {
        latitude: data[0].latitude,
        longitude: data[0].longitude
      },
      address: data[0].formattedAddress
    });
    rest.save(function(err,r){
      console.log(r);
      res.redirect('/restaurants');
    });
  });
});

// router.get('/restaurants', function(req,res){
//   Restaurant.find(function(err, restaurants){
//     res.render('restaurants', {
//       restaurants: restaurants
//     })
//   })
// })

//PAGINATION
router.get('/restaurants/', function(req,res){
  var page = parseInt(req.query.page || 1);
  var arr =[];
  var multi;
  Restaurant.find({}, function(err, rest){
    console.log(rest.length);
    var len = rest.length;
    if(len%10 ===0){
      multi=len/10;
    }else{
      multi = (len/10) + 1;
    }
    for (var i = 1; i<= multi; i++){
      arr.push({i: i});
    }
    Restaurant.findTheNextTen(page, function(rests){
      res.render('restaurants', {
        restaurants: rests,
        list: arr
      })
    })
  })
})

router.get('/restaurant/:id', function(req,res){
  Restaurant.findById(req.params.id, function(err, rest){
    rest.getReviews(rest._id, function(err, reviews) {
      rest.stars(function(numStars) {
        // console.log("averageRating", rest.averageRating)
        // console.log("stars", numStars);
        var arr = [];
        for(var i=0; i<Math.floor(numStars); i++) {
          arr.push(i);
        }
        res.render('singleRestaurant', {
          restaurant: rest,
          reviews: reviews,
          stars: arr
        })
      })
    })
  })
});

router.get('/restaurant/:id/review', function(req,res){
  Restaurant.findById(req.params.id, function(err, rest){
  res.render('newReview', {
    restaurant: rest,
    user: req.user
      });
    })
  })

router.post('/restaurant/:id/review', function(req, res){
  rev = new Review({
    stars: req.body.stars,
    content: req.body.content,
    restaurant: req.params.id,
    user: req.user
  }).save(function(err, review){
    if (err) console.log(err)
    res.redirect('/restaurant/'+ req.params.id);
  });
})

// THE WALL - anything routes below this are protected!
router.use(function(req, res, next){
  if (!req.user) {
    res.redirect('/login');
  } else {
    return next();
  }
});

//get singleProfile
router.get('/profile/:id', function(req, res, next){
  User.findById(req.params.id, function(err, user){
    console.log(user);
    user.getReviews(user._id, function(err, reviews) {
      // review.stars(function(numStars) {
      //   // console.log("averageRating", rest.averageRating)
        console.log("stars", reviews.stars);
        var arr = [];
        for(var i=0; i<Math.floor(reviews.stars); i++) {
          arr.push(i);
        }
    user.getFollows(function(err, following, followers){
      if (err) console.log(err);
      user.isFollowing(req.params.id, function(result) {
        res.render('singleProfile', {
          user: user,
          following: following,
          followers: followers,
          iAmFollowing: result,
          reviews: reviews
        });
        // console.log("followers TO" + followers);
        // console.log("following FROM" + following);
      })
      // var amIAlreadyFollowing=followers.filter(function(follow){
      //   return follow.from._id === req.user._id;
      // }).length>0;
      // console.log(amIAlreadyFollowing);

      })
    })
  })
})
// })

router.get('/profile', function(req, res){
  User.find(function(err, users){
    console.log(users);
    res.render('profiles',{
      users:users
    });
  });
});

router.post('/profile/:id/follow', function(req, res){
  req.user.follow(req.params.id, function(){
    res.redirect('/profile/'+ req.params.id);
  });
});

router.post('/profile/:id/unfollow', function(req, res){
  req.user.unfollow(req.params.id, function(){
    res.redirect('/profile/'+ req.params.id);
  });
});


module.exports = router;
