var express = require('express');
var router = express.Router();
var models = require('../models/models');
var _ = require('underscore');
var User = models.User;
var Follow = models.Follow;
var Restaurant = models.Restaurant;
var Review = models.Review;

// ----------------------------------------------
// ADD AVG RATING ATTRIBUTE TO RESTAURANTS
// ----------------------------------------------
// Restaurant.find({},function(err,data) {
//   if (!err) {
//     console.log('updating....')
//     _.forEach(data, function(element) {
//       Restaurant.update({_id:element._id}, {
//         averageRating: element.totalScore/element.reviewCount
//       },function() {})
//     })
//   }
// })

// Geocoding - uncomment these lines when the README prompts you to!
var NodeGeocoder = require('node-geocoder');
var geocoder = NodeGeocoder({
  provider: "google",
  apiKey: process.env.GEOCODING_API_KEY || "AIzaSyDHY_Z52IV3Et-b4q-KrcOK-6r5FXW4cxw",
  httpAdapter: "https",
  formatter: null
});

// -----------------------------------------------------\\
// PROTECTION STARTS!!!!!!!-----------------------------\\
// THE WALL - anything routes below this are protected!-\\
// -----------------------------------------------------\\

router.use(function(req, res, next){
  if (!req.user) {
    res.redirect('/login');
  } else {
    return next();
  }
});

// ----------------------------------------------
// ROUTES TO USER PAGES
// ----------------------------------------------
router.get('/', function(req,res,next) {
  res.redirect('/user/'+req.user._id)
})

router.get('/user/:id', function(req,res,next) {
  User.findById(req.params.id, function(err,user) {
    user.getFollowers(req.params.id,function(err,followers,following) {
      user.getReviews(req.params.id, function(err,reviews) {
        res.render('user', {
          user:user,
          followers:followers,
          following:following,
          reviews: reviews
        })
      })
    })
  })
})
// ----------------------------------------------
// FOLLOW AND UNFOLLOW
// ----------------------------------------------
router.post('/user/:id/:request', function(req,res,next) {
  if (req.params.request==='follow' || req.params.request==='unfollow')
    req.user[req.params.request].call(req.user, req.params.id, function() {res.sendStatus(200)})
})

// ----------------------------------------------
// ROUTE TO PROFILES LIST
// ----------------------------------------------
router.get('/profiles', function(req,res,next) {
  User.find().nin('_id', [req.user._id]).exec(function(err, users) {
    if (err) {
      res.render('/error', {error:err})
    } else {
      User.findById(req.user._id, function(err,user) {
        user.getFollowers(req.user._id,function(err,followers,following) {
          var countData = _.countBy(following, function(val){
            return val.user2Id._id;
          });
          console.log(countData);
          res.render('profiles', {users:users, fObj:countData});
        })
      })
    }
  })
})

// ----------------------------------------------
// ROUTES TO RESTAURANTS
// ----------------------------------------------

router.get('/restaurants/list/:x', function(req,res,next) {
  var current = parseInt(req.params.x) || 1
  console.log(req.query)
  var queries = {}
  _.forEach(req.query,function(key,val) {
    if (key.length!==0) {queries[val]=key}
  })
  console.log(queries)
  Restaurant.find()
    .sort(queries)
    .skip(10*(req.params.x-1))
    .limit(11)
    .exec(function(err,food) {
    if (err) {
      res.render('/error', {error:err})
    } else if (food.length===0) {
      res.render('sneaky', {data:true})
    } else {
      res.render('restaurants', {
        prev: current-1,
        next: current+1,
        isNext:food.slice(10).length,
        restaurants:food.slice(0,10)
      })
    }
  })
})
router.get('/restaurants/new', function(req,res,next) {
  res.render('newRestaurant')
})
router.get('/restaurants/:id', function(req,res,next) {
  Restaurant.findById(req.params.id, function(err,food) {
    if (err) {
      res.render('/error', {error:err})
    } else {
      console.log(food)
      food.getReviews(food._id, function(error, reviews) {
        res.render('singleRestaurant', {
          restaurant:food,
          reviews:reviews
        })        
      })
    }
  })
})
router.post('/restaurants/new', function(req, res, next) {
  geocoder.geocode(req.body.address, function(err, data) {
    if (err) {return}
      var restaurant = new Restaurant();
    restaurant.name = req.body.name
    restaurant.category = req.body.category
    restaurant.latitude = data[0].latitude
    restaurant.longitude = data[0].longitude
    restaurant.price = '$'.repeat(req.body.price)
    restaurant.opentime = req.body.opentime
    restaurant.closingtime = req.body.closingtime
    restaurant.reviewCount = 0
    restaurant.totalScore = 0

    restaurant.save(function(error) {
      if (error) {
        console.log('error!!!!!')
        res.render('/error',{error:error})
      } else {
        console.log('saved!!!!!!')
        res.redirect('/restaurants')
      }
    })
  });
});
// ----------------------------------------------
// REVIEW ROUTES
// ----------------------------------------------
router.get('/reviews/new', function(req,res,next) {
  Restaurant.find({},{name:1, _id:0}, function(error, food) {
    if (error) {
      res.render('/error', {error:error})
    } else {
      res.render('newReview',{
        data:JSON.stringify(food.map(function(a) {return a.name}))
      })
    }
  })
})
router.post('/reviews/new', function(req,res,next) {
  console.log('post noticed')
  Restaurant.findOne({name:req.body.name}, function(error,food) {
    if (error) {
      res.redirect('/reviews/new')
    } else {
      console.log('restaurant found')
      var review = new Review()
      review.rId = food._id
      review.uId = req.user._id
      review.content = req.body.content
      review.stars = req.body.rating
      review.save(function(err) {
        if (err) {
          res.redirect(err,{error:err})
        } else {
          console.log('review saved')
          // update score values of restaurant
          Restaurant.update({_id:food._id}, {
            $inc: {
              totalScore: review.stars,
              reviewCount: 1,}, 
            $set: {
              averageRating: (food.totalScore+review.stars)/(food.reviewCount+1)
          }}, function(error) {
            if (error) {console.log('error!!!!!')}
          })
          res.redirect('/restaurants/list/1')
        }
      })
    }
  })
})
module.exports = router;