var express = require('express');
var router = express.Router();
var models = require('../models/models');
var User = models.User;
var Follow = models.Follow;
var Restaurant = models.Restaurant;
var Review = models.Review;

// Geocoding - uncomment these lines when the README prompts you to!
var NodeGeocoder = require('node-geocoder');
var geocoder = NodeGeocoder({
  provider: "google",
  apiKey: process.env.GEOCODING_API_KEY || "AIzaSyDS3XbqXdygre1Y0eLBDCdR1L8L1uToqPk",
  httpAdapter: "https",
  formatter: null
});






// THE WALL - anything routes below this are protected!
// router.use(function(req, res, next){
//   if (!req.user) {
//     res.redirect('/login');
//   } else {
//     return next();
//   }
// });
router.get('/prank' , function(req, res) {
  res.render('prank');
});

router.get('/singleProfile/:id', function(req, res) {
  User.findById(req.params.id,function(error, user) {
    if (error) {
      return req.status(400).render('error', {
        message: error
      })
    }
    user.getFollowers(function(followers, followings) {
      res.render('singleProfile',{
        user: user,
        allFollowers: followers,
        allFollowings: followings
      })
    });
  });
})

router.get('/profiles' , function(req, res) {
  res.render('profiles');
});

router.post('/follow/:id', function(req, res) {
  req.user.follow(req.params.id, function(error) {
    if (error) {
      return res.status(400).render('error', {
        message:error
      });
    } else {
      res.redirect('/singleProfile' + req.params.id)
    }
  })
});

router.get('/restaurants', function(req, res, next) {
  Restaurant.find(function(error, restaurants) {
    if (error) {
      return res.status(400).render('error', {
        message: error
      })
    }
    res.render('restaurants', {
      restaurants: restaurants
    })
  })
})

router.get('/restaurants/new', function(req, res, next) {
  res.render('newRestaurant')
});


router.post('/restaurants/new', function(req, res, next) {
  geocoder.geocode(req.body.address, function(err, data) {
    console.log(err);
    console.log(data);
    var r = new models.Restaurant({
      name: req.body.name,
      category: req.body.category,
      latitude: data[0].latitude,
      longitude: data[0].longitude,
      price: req.body.price,
      opentime: parseInt(req.body.opentime),
      closetime: parseInt(req.body.closetime),
      totalScore: 0,
      reviewCount: 0
    })
    r.save(function(err, user) {
      if (error) {
        return res.status(400).render('error', {
          message:error
        });
      }
      res.redirect('/restaurants');
    });
  });
});

router.get('/restaurants/:id', function(req, res, next) {
  Restaurant.findById(req.params.id, function(error, restaurant) {
      restaurant.getReviews(restaurant._id, function(error, reviews) {
      if (error) {
        return res.status(400).render('error', {
          message:error
        });
      } 
      res.render('singleRestaurant', {
        restaurant: restaurant,
        reviews: reviews
      })
    })
  })
})

router.get('/restaurants/:id/review', function(req, res, next) {
  res.render('newReview')
})

router.post('/restaurants/:id/review', function(req, res, next) {
  Restaurant.findById(req.params.id, function(error, restaurant) {
    restaurant.totalScore += parseInt(req.body.stars);
    restaurant.reviewCount ++;
    var r = new models.Review({
      content: req.body.content,
      stars: parseInt(req.body.stars),
      restaurantId: req.params.id,
      userId: req.user._id
    })
    restaurant.save(function(err, user) {
      r.save(function(err, user) {
        if (error) {
          return res.status(400).render('error', {
            message:error
          });
        }
        res.redirect('/restaurants/:id');
      })
    });
  })
});

module.exports = router;