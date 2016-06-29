var express = require('express');
var router = express.Router();
var models = require('../models/models');
var User = models.User;
var Follow = models.Follow;
var Restaurant = models.Restaurant;
var Review = models.Review;

var NodeGeocoder = require('node-geocoder');
var geocoder = NodeGeocoder({
  provider: "google",
  apiKey: process.env.GEOCODING_API_KEY || "AIzaSyA-GcHv9qx1ep9lfoCSMvOk5FGr2GBUVAE",
  httpAdapter: "https",
  formatter: null
});

// THE WALL - anything routes below this are protected!
router.use(function(req, res, next){
  console.log("THE WALL")
  if (!req.user) {
    console.log("help")
    res.redirect('/login');
  } else {
    next();
  }
});

router.get('/', function(req, res, next) {
  console.log(req.user._id);
  res.redirect('/profiles/' + req.user._id)
})


router.get('/restaurants/new', function(req, res, next) {
    res.render('newRestaurant');
})

router.post('/restaurants/new', function(req, res, next){

  geocoder.geocode(req.body.location, function(err, data) {
    console.log(err);
    console.log(data);
    var rest = new Restaurant({
      name: req.body.name,
      category: req.body.category,
      price: req.body.price,
      openTime: req.body.openTime,
      closingTime: req.body.closingTime,
      location: {
        latitude: data[0].latitude,
        longitude: data[0].latitude
      }
    })
    rest.save(function(err, r) {
      console.log(err);
      console.log(r)
      res.redirect('/restaurants/new')
    })
  })
})

  
router.get('/restaurants', function(req, res){
  Restaurant.find(function(err, restaurants) {
    res.render('restaurants', {
      restaurants: restaurants
    })
  })
})

router.get('/restaurants/list', function(req, res){
  res.redirect('/restaurants/list/1');
})

router.get('/restaurants/list/:page', function(req, res){
  Restaurant.count(function(err, count) {
    var num = Math.floor(count / 5) + 1;
    var array = [];
    for (var i = 1; i < num+1; i++) {
      array.push(i);
    }

    console.log("HELLO" + count)

  Restaurant.getTen(req.params.page || 1, function(display, hasPrev, Next, Previous, hasNext) {
              console.log(display);
              console.log(hasPrev);
              console.log(Next);
              console.log(Previous);
              console.log(hasNext);
              res.render('restaurants', {
                restaurants: display,
                hasPrev: hasPrev,
                next: Next,
                prev: Previous,
                hasNext: hasNext,
                array: array
              })
          })
  })
})

router.get('/restaurants/:id', function(req, res) {
  Restaurant.findById(req.params.id, function(err, rest) {
    res.render('singleRestaurant', {
      restaurant: rest
    })
  })
})


router.get('/profiles', function(req,res) {
  User.find(function(err, user) {
    if (err) {
      res.status(400).send(error);
    }
    res.render('profiles', {
      user: user
    })
  })

});

router.get('/profiles/:id', function(req, res) {
  User.findById(req.params.id, function(err, user) {
    console.log(err, user)
    user.getFollowers(user._id, function(err, myFollowers, myFollowed) {
      req.user.isFollowing(user._id, function(err, iAmFollowing) {
        console.log(req.user._id);
        console.log(req.params.id);
        if(req.user._id == req.params.id) {
          res.render('myProfile', {
            user: user,
            following: myFollowed,
            followers: myFollowers
          });
        }
        console.log(iAmFollowing);
        res.render('singleProfile', {
          user: user,
          following: myFollowed,
          followers: myFollowers,
          tf: iAmFollowing
       })
      })  
    })
  })
})

router.post('/follow/:id', function(req, res) {
  req.user.follow(req.params.id, function(err, pair) {
      res.redirect('/profiles/' + req.params.id)
  })
})

router.post('/unfollow/:id', function(req, res) {
  req.user.unfollow(req.params.id, function(err, deleted) {
      if(req.body.fromMe) {
        res.redirect('/');
      } else {
        res.redirect('/profiles/' + req.params.id);
      }
  })
})

module.exports = router; 