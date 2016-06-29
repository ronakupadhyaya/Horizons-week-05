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



router.get('/prank' , function(req, res) {
  res.render('prank');
});

// THE WALL - anything routes below this are protected!
router.use(function(req, res, next){
  if (!req.user) {
    res.redirect('/login');
  } else {
    return next();
  }
});

router.get('/', function(req, res) {
  res.redirect('restaurants/list/1');
})


router.get('/singleProfile/:id', function(req, res) {
  User.findById(req.params.id,function(error, user) {
    if (error) {
      return req.status(400).render('error', {
        message: error
      })
    }
    user.getFollowers(function(error, followers, following) {
      res.render('singleProfile',{
        user: user,
        followers: followers,
        following: following
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

router.post('/unfollow/:id', function(req, res) {
  req.user.unfollow(req.params.id, function(error) {
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



router.get('/restaurants/list/:page', function(req, res, next) {
  var page = parseInt(req.params.page)
  if (page < 1) {
    res.status(400).send('Bad page index');
    return;
  }
  var q = Restaurant.find();
  var name = parseInt(req.query.name);
  var rating = parseInt(req.query.rating);
  var price = parseInt(req.query.price);
  if (name) {
    q = q.sort({name: name});
  } else if (rating && price){
    q = q.sort({rating: rating, price: price});
  } else if (rating && (!price)){
    q = q.sort({rating: rating});
  } else if ((!rating) && price){
    q = q.sort({price: price});
  }

  q.skip(10*(page -1))
  .limit(11)
  .exec(function(error, restaurants) {
    if (error) {
      res.status(400).render('error') 
      return;
    }
    var reslength = restaurants.length
    var displayRestaurants = restaurants.splice(0,9)
    var pageTotal = [];
    Restaurant.count(function(error, totalRestaurants) {
      if (error) {
        res.status(400).send('error');
        return; 
      }
      var pageNum = Math.floor(totalRestaurants/10);
      if (totalRestaurants%10) pageNum++;
      for (var i=1; i<=pageNum; i++) {
        pageTotal.push(i)
      }
      res.render('restaurants', {
        restaurants: displayRestaurants,
        page: page,
        prev: page - 1,
        next: page + 1,
        hasNext: reslength === 11,
        pageTotal: pageTotal
      })   
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
      opentime: req.body.opentime,
      closetime: req.body.closetime,
      totalScore: 0,
      reviewCount: 0,
      rating: 0
    })
    r.save(function(error, user) {
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
    if (error) {
      return res.status(400).render('error', {
        message:error
      })
    }     
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
    if (error) {
      return res.status(400).render('error', {
        message:error
      });
    }
    restaurant.totalScore += parseInt(req.body.stars);
    restaurant.reviewCount ++;
    var r = new models.Review({
      content: req.body.content,
      stars: req.body.stars,
      restaurantId: req.params.id,
      userId: req.user._id
    })
    restaurant.save(function(error, user) {
      r.save(function(error, user) {
        if (error) {
          return res.status(400).render('error', {
            message:error
          });
        }
        res.redirect('/restaurants/' + req.params.id);
      })
    });
  })
});

module.exports = router;