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

// THE WALL - any routes below this are protected!
router.use(function(req, res, next){
  if (!req.user) {
    res.redirect('/login');
  } else {
    return next();
  }
});

router.get('/', function(req, res) {
  res.redirect('/restaurants');
});

router.get('/restaurants', function(req, res) {
  var page = parseInt(req.query.page) || 1;
  var resLim = 6
  Restaurant.find()
  .sort('name')
  .limit(5)
  .skip(resLim * (page-1))
  .exec(function(err, foundRestaurants) {
    if(err) {
      res.json(err);
    } else {
      res.render('restaurants', {
        restaurants: foundRestaurants.slice(0, 5),
        page: page,
        hasNext: foundRestaurants.length === resLim,
        hasPrev: page > 1
      })
    }
  })
});

router.get('/restaurants/:restaurantId', function(req, res) {
  Restaurant.findById(req.params.restaurantId, function(err, foundRestaurant) {
    if(err) {
      res.json(err);
    } else {
      res.render('singleRestaurant', {
        restaurant: foundRestaurant
      })
    }
  })
});

router.get('/restaurants/new', function(req, res) {
  res.render('newRestaurant');
})

router.post('/restaurants/new', function(req, res, next) {
  var restaurant = new Restaurant({
    name: req.body.name,
    category: req.body.category,
    latitude: req.body.latitude, //TODO: FIX THIS LATER WITH GOOGLE MAPS
    longitude: req.body.longitude, //TODO: FIX THIS LATER WITH GOOGLE MAPS
    price: req.body.price,
    openTime: req.body.openTime,
    closingTime: req.body.closingTime
  }).save(function(err) {
    if(err) {
      res.json(err);
    } else {
      res.redirect('/restaurants')
    }
  })

  // Geocoding - uncomment these lines when the README prompts you to!
  // geocoder.geocode(req.body.address, function(err, data) {
  //   console.log(err);
  //   console.log(data);
  // });

});

router.get('/profiles', function(req, res) {
  User.find(function(err, userArray) {
    if(err) {
      res.json(err);
    } else {
      res.json(userArray);
    }
  })
});

router.get('/profiles/:displayName', function(req, res) {
  User.findOne({displayName:req.params.displayName}, function(err, found) {
    var decision = {
      value: "Follow",
      action: "follow"
    };
    Follow.findOne({from:req.user._id, to:found._id}, function(err, follow) {
      if(err) {
        res.json(err)
      } else if (follow) {
        decision.value = "Unfollow";
        decision.action = "unfollow";
        res.render('singleProfile', {
          user: found,
          decision: decision
        })
      } else {
        // decision.value = "Unfollow";
        // decision.action = "unfollow";
        res.render('singleProfile', {
          user: found,
          decision: decision
        })
      }
    })
  })
});

router.post('/profiles/:displayName/follow', function(req, res) {
  User.findOne({displayName:req.params.displayName}, function(err, found) {
    console.log(found);
    req.user.follow(found._id, function(err, followed) {
      if(err) {
        res.json(err);
      } else {
        res.redirect('/profiles/' + req.params.displayName);
      }
    })
  })
})

router.post('/profiles/:displayName/unfollow', function(req, res) {
  User.findOne({displayName:req.params.displayName}, function(err, found) {
    console.log(found);
    req.user.unfollow(found._id, function(err, unfollowed) {
      if(err) {
        res.json(err);
      } else {
        res.redirect('/profiles/' + req.params.displayName);
      }
    })
  })
})

module.exports = router;
