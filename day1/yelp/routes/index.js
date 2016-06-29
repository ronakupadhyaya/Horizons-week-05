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
  apiKey: process.env.GEOCODING_API_KEY || "AIzaSyAPz1rluzOfrwgb6_WvzYIgY4s6l2vqzok",
  httpAdapter: "https",
  formatter: null
});

router.post('/restaurant/new', function(req, res, next) {

  // Geocoding - uncomment these lines when the README prompts you to!
  geocoder.geocode(req.body.location, function(err, data) {
    console.log(err);
    console.log(data);
    var r = new Restaurant({
      name: req.body.name,
      category: req.body.category,
      price: req.body.price,
      openTime: req.body.openTime,
      closingTime: req.body.closeTime,
      location: {
        latitude: data[0].latitude,
        longitude: data[0].longitude
      }
    })
    r.save(function(err, restaurant) {
      console.log(err);
      console.log(restaurant);
      res.redirect('/restaurants');
    })
  });
  
});

router.get('/restaurant/new', function(req, res) {
  res.render('newRestaurant');
});

router.get('/restaurants/:page', function(req, res) {
  var page = parseInt(req.params.page || 1);
  var q = Restaurant.find();
  if (req.query.name) {
    q = q.sort({name: req.query.name});
  } else if (req.query.rating) {
    q = q.sort({averageRating: req.query.rating});
  }
  q.limit(4)
  .skip(3*(page-1))
  .exec(function(error, restaurants) {
    var displayRest = restaurants.slice(0,3);
    res.render('restaurants', {
      restaurants: displayRest,
      name: req.query.name,
      rating: req.query.rating,
      prev: page -1,
      next: page +1,
      hasNext: restaurants.length === 4
    })
  })
})

router.get('/restaurant/:id', function(req, res) {
  Restaurant.findById(req.params.id, function(error, restaurant) {
    restaurant.getReviews(req.params.id, function(reviews){
      res.render('singleRestaurant', {
        restaurant: restaurant,
        reviews: reviews,
        key: "AIzaSyAPz1rluzOfrwgb6_WvzYIgY4s6l2vqzok"
      })
    })
  })
})


// THE WALL - anything routes below this are protected!
router.use(function(req, res, next){
  if (!req.user) {
    res.redirect('/login');
  } else {
    return next();
  }
});

router.get('/', function(req, res, next) {
  User.find(function(error, users) {
    if (error) {
      console.log('BIG ERROR');
    }
    res.render('profiles', {
      users: users
    });
  })
})

router.post('/profile/:id/follow', function(req, res, next) {
  req.user.follow(req.params.id, function(err) {
    res.redirect('/profile/'+req.params.id);
  })
})

router.post('/profile/:id/unfollow', function(req, res, next) {
  req.user.unfollow(req.params.id, function(err) {
    res.redirect('/profile/'+req.params.id);
  })
})

router.get('/profile/:id', function(req, res, next) {
  User.findById(req.params.id, function(error, user) {
    user.getFollowers(function(followers, following) {
      var amIAlreadyFollowing = followers.filter(function(users) {
        return users.from._id.equals(req.user._id);
      }).length > 0;
      user.getReviews(function(reviews) {
        res.render('singleProfile', {
          user: user,
          followers: followers,
          following: following,
          reviews: reviews,
          amIAlreadyFollowing: amIAlreadyFollowing
        })
      })
    })
  })
})

router.get('/review/:id/new', function(req, res, next) {
  res.render('newReview', {
    id: req.params.id
  });
})

router.post('/review/:id/new', function(req, res, next) {
  var r = new Review({
    content: req.body.content,
    stars: parseInt(req.body.stars),
    restaurant: req.params.id,
    user: req.user._id
  })
  r.save(function(error, review) {
    if (error) return next(error);
    Restaurant.findById(req.params.id, function(error, restaurant) {
      if (error) return next(error);
      restaurant.totalScore += review.stars;
      restaurant.reviewCount ++;
      restaurant.averageRating = restaurant.totalScore / restaurant.reviewCount;
      restaurant.save(function(error, restaurant) {
        if (error) return next(error);
        res.redirect('/restaurant/'+req.params.id)
      })
    })
  })
})

// router.post('/restaurants/:page', function(req, res, next) {
//   if (req.body.name) {
//     var page = parseInt(req.params.page || 1)
//     Restaurant.find().sort({name: req.body.name})
//     .limit(4)
//     .skip(3*(page-1))
//     .exec(function(error, restaurants) {
//       var displayRest = restaurants.slice(0,3);
//       res.render('restaurants', {
//         restaurants: displayRest,
//         prev: page -1,
//         next: page +1,
//         hasNext: restaurants.length === 4
//       })
//     })
//   }
//   if (req.body.rating) {
//     var page = parseInt(req.params.page || 1)
//     Restaurant.find().sort({averageRating: req.body.rating})
//     .limit(4)
//     .skip(3*(page-1))
//     .exec(function(error, restaurants) {
//       var displayRest = restaurants.slice(0,3);
//       res.render('restaurants', {
//         restaurants: displayRest,
//         prev: page -1,
//         next: page +1,
//         hasNext: restaurants.length === 4
//       })
//     })
//   }
// })

// router.post('/restaurants/?rating', function(req, res, next) {
//   Restaurants.find().sort({})
// })

module.exports = router;