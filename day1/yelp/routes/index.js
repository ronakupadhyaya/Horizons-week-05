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

router.get('/', function(req, res) {
  res.redirect('/restaurants')
})

router.get('/restaurants', function(req, res) {
  res.render('restaurants')
})

router.get('/profiles', function(req, res) {
  User.find(function(err, foundUsers) {
    if(err) {
      res.status(400).json(err);
    } else {
      res.json(foundUsers);
      // res.render('profiles', {
      //   // something
      // })
    }
  })
})

// router.get('/profiles', function(req, res) {
//   Follows.
// })

router.get('/profiles/:displayName', function(req, res) {
  User.findOne({displayName: req.params.displayName}, function(err, foundUser) {
    if(err) {
      res.status(400).json(err);
    } else {
      // res.json(foundUser.email)
      var theDecision = {
        action: 'Follow'
      }
      Follow.findOne({from: req.user._id, to: foundUser._id}, function(err, foundFollow) {
        if(err) {
          res.status(400).json(err);
        } else if(foundFollow){
          console.log('founddd')
          theDecision.action = "Unfollow"
          res.render('singleProfile', {
            user: foundUser,
            theDecision: theDecision
          })
        } else {
          console.log('no found')
          res.render('singleProfile', {
            user: foundUser,
            theDecision: theDecision
          })
        }
      })
    }
  })
});

router.post('/profiles/:displayName/follow', function(req, res) {
  var followeeName = req.params.displayName;
  User.findOne({displayName: followeeName}, function(err, foundUser) {
    if(err) {
      res.status(400).json(err);
    } else {
      var followeeId = foundUser._id;
      req.user.follow(followeeId, function(err, followed) {
        if(err) {
          res.status(400).json(err);
        } else {
          // res.render('singleProfile', {
          //   user: foundUser,
          //   following: true
          // })
          res.redirect('/profiles/' + foundUser.displayName)
        }
      })
    }
  })
})

router.post('/profiles/:displayName/unfollow', function(req, res) {
  var followeeName = req.params.displayName;
  User.findOne({displayName: followeeName}, function(err, foundUser) {
    if(err) {
      res.status(400).json(err);
    } else {
      var followeeId = foundUser._id;
      req.user.unfollow(followeeId, function(err, unfollowed) {
        if(err) {
          res.status(400).json(err);
        } else {
          res.redirect('/profiles/' + foundUser.displayName)
          // res.render('singleProfile', {
          //   user: foundUser,
          //   following: false,
          //   action: followeeName === req.user.displayName ? "follow" : "unfollow"
          // })
        }
      })
    }
  })
})

router.get('/restaurants/new', function(req, res, next) {
  Restaurant.find(function(err, foundRestaurants) {
    if(err) {
      res.status(400).json(err);
    } else {
      res.render('newRestaurant');
    }
  })
})

router.post('/restaurants/new', function(req, res, next) {
  var restaurant = new Restaurant({
    name: req.body.name,
    category: req.body.category,
    latitude: req.body.latitude,
    longitude: req.body.longitude,
    price: req.body.price,
    openTime: req.body.openTime,
    closingTime: req.body.closingTime
  }).save(function(err, restaurant) {
    if(err) {
      res.status(400).json(err);
    } else {
      res.redirect('/restaurants');
    }
  });

// also implement pagination
router.get('/restaurants', function(req, res, next) {
  Restaurant.find(function(err, foundRestaurants) {
    if(err) {
      res.status(400).json(err);
    } else {
      res.render('restaurants', {
        found: foundRestaurants
      })
    }
  })
})


  // Geocoding - uncomment these lines when the README prompts you to!
  // geocoder.geocode(req.body.address, function(err, data) {
  //   console.log(err);
  //   console.log(data);
  // });

});

module.exports = router;
