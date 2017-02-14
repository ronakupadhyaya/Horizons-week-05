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


router.get('/users/:userId', function(req, res){
  User.findById(req.params.userId, function(err, user){
    if(err){
      res.send(err);
    }else{
      user.getFollows(function(err, followers, following){
        if(err){
          console.log(err);
        } else{
          res.render('singleprofile', {user: user, /*review: reviews,*/ followers: followers, following: following})
        }
      });
    }
  })
})

router.get('/users', function(req, res){
  User.find(function(err, users){
    if(err){
      console.log(err);
    } else{
      res.render('profiles', {Users: users})
    }
  })
})

router.post('/unfollow/:uid2', function(req, res){
  req.user.unFollow(req.params.uid2);
  res.render('singleprofile');
})

router.get('/restaurants', function(req, res){
  Restaurant.find(function(err, results){
    if(err){
      res.send(err);
    } else{
      res.render('restaurants', {restaurants: results})
    }
  })
})

router.get('/restaurant/:id', function(req, res){
  Restaurant.findById(req.params.id, function(err, result){
    if(err){
      res.send(err);
    } else{
      res.render('singeRestaurant',{restaurant:result})
    }
  })
})


router.get('/restaurants/new', function(req, res){
  res.render('newRestaurant', function(err){
    if(err){
      res.JSON(err);
    }
  })
})

router.post('/restaurants/new', function(req, res, next) {

  // Geocoding - uncomment these lines when the README prompts you to!
  // geocoder.geocode(req.body.address, function(err, data) {
  //   console.log(err);
  //   console.log(data);
  // });

var restaurant = new Restaurant{(
  name: req.body.name,
  category: 'Korean'
  latitude: req.body.latitude,
  longitude: req.body.longitude,
  price: '$',
  opentime: req.body.opentime,
  closingtime: req.body.closetime
)}

restaurant.save(function(err){
  if(err){
    res.JSON(err);
  }
})
});

module.exports = router;
