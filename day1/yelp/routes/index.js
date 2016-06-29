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
  apiKey: process.env.GEOCODING_API_KEY,
  httpAdapter: "https",
  formatter: null
});

// THE WALL - anything routes below this are protected!
router.use(function(req, res, next){
  if (!req.user) {
    res.redirect('/login');
  } else {
    return next();
  }
});

router.get('/singleRestaurant/:id', function(req, res, next) {
  var id = req.params.id;
  
  Restaurant.findById(id, function(error, restaurant) {
    if (error) return next(error);
   
    res.render('singleRestaurant', {
      restaurant: restaurant,
      key: process.env.GEOCODING_API_KEY
    });
  })
  
});

router.get('/restaurants/new', function(req, res, next) {
  res.render('newRestaurant');
});


router.post('/restaurants/new', function(req, res, next) {

  // Geocoding - uncomment these lines when the README prompts you to!
  geocoder.geocode(req.body.address, function(err, data) {
    if (err) return next(err);
      
     
      var newRestaurant = new Restaurant({
      name: req.body.name,
      price: req.body.price,
      category: req.body.category,
      address: req.body.address,
      latitude: data[0].latitude,
      longitude: data[0].longitude,
      openTime: req.body.openTime,
      closingTime: req.body.closeTime
      });

      newRestaurant.save(function(error) {
        if (error) return next(error);
        console.log("Success");
      })
      
      res.redirect('/restaurants');

    
  });
  
});

router.get('/restaurants', function(req, res, next) {
  var rating = req.query.rating;
  var name = req.query.name;
  var price = req.query.price;
  if (name) {
    Restaurant.find({}).limit(10).sort({name: name}).exec(function(err, sortedRestaurants) {
    if (err) return next(err);
    res.render('restaurants', {
      restaurants: sortedRestaurants
    });
  })
  }
  if (rating) {
    Restaurant.find({}).limit(10).sort({rating: rating}).exec(function(err, sortedRestaurants) {
    if (err) return next(err);
    res.render('restaurants', {
      restaurants: sortedRestaurants
    });
  })
}
if (price) {
  Restaurant.find({}).limit(10).sort({price: price}).exec(function(err, sortedRestaurants) {
    if (err) return next(err);
    res.render('restaurants', {
      restaurants: sortedRestaurants
    });
  })
}
else {
     Restaurant.find(function(err, restaurants) {
    if (err) return next(err);
    res.render('restaurants', {
      restaurants: restaurants
    });
  })
   }
  
    })
  // res.redirect('/restaurants/1')
  


router.get('/restaurants/:x', function(req, res, next){
  
  var n = parseInt(req.params.x || 1);
    var pageArr = [];
  Restaurant.getTen(n, function(err, restaurants){
    Restaurant.count(function(err, count) {
      var arrLength = count / 10;
    for (var i = 1; i <= arrLength; i++) {
      pageArr.push(i);
    }
    if (err) return next(err);
    else {res.render('restaurants', {
      restaurants: restaurants,
      pages: pageArr,
      n: n,
      prev: n-1,
      next: n+1
    })
    }
    
  })
  })
})

router.get('/profiles', function(req, res, next) {
  User.find(function(error, usersFromMongo) {
    if (error) return next(error);
    res.render('profiles', {
    users: usersFromMongo
  });
  });
  
});

router.post('/unfollow/:id', function(req, res, next) {
  var idToUnfollow = req.params.id;
  User.findById(req.user._id, function(err, user) {
    user.unfollow(idToUnfollow, function(resultOfCallback) {
      if (!resultOfCallback) {
        res.send("You already unfollowed this person");
      } else {
        res.redirect("/singleProfile/" + req.user._id);
      }
    })
  })
 
}) 

router.post('/singleProfile/:id', function(req, res, next) {
  var idToFollow = req.params.id;
 
  req.user.follow(idToFollow, function(result) {
    // time 
    if (!result) {
      res.send("You are already following");
    }
    else {
     res.redirect("/singleProfile/" + idToFollow);
    }

  })
  // time

})

router.get('/singleProfile/:id', function(req, res, next) {
  var id = req.params.id;
  User.findById(id, function(error, user) {
    if (error) {
      return next(error);
    }
    user.getFollowers(function(err, followers, following) {
      if (err) return next(err);
      


      res.render('singleProfile', {
        user: user,
        followers: followers,
        following: following          
      });
    })
  
  })
  
})



module.exports = router;