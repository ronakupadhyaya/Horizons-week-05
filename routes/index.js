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
  apiKey: process.env.GEOCODING_API_KEY || "AIzaSyC1XuwbLnGVoxrozcTM1Xkpu728xBjM4O8",
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

router.get('/', function(req, res){
  res.redirect('/restaurants');
});

router.get('/singleProfile/:id', function(req, res){
  User.findById(req.params.id, function(err, user){
    if(err){
      return res.status(400).render('error', {
        message: err
      });
    }
    user.getFollowers(function(error, followers, following) {
      res.render('singleProfile', {
        user: user,
        followers: followers,
        following: following
      })
    })
  });
});

router.get('/profiles', function(req, res){
  User.find(function(error, users){
    if(error){
      return res.status(400).render('error', {
        message: err
      });
    }
    res.render('profiles', {
      users: users
    });
  });
});

router.post('/follow/:id', function(req, res){
  req.user.follow(req.params.id, function(error){
    if (error) {
      return res.status(400).render('error', {
        message: error
      });
    } else {
      res.redirect('/singleProfile/' + req.params.id);
    }
  });
});

router.post('/unfollow/:id', function(req, res){
  req.user.unfollow(req.params.id, function(error){
    if (error) {
      return res.status(400).render('error', {
        message: error
      });
    } else {
      res.redirect('/singleProfile/' + req.params.id);
    }
  });
});

router.get('/restaurants', function(req, res, next){
  res.redirect('/restaurants/list/1');
});

router.get('/restaurants/list/:page', function(req, res, next){

  var page = parseInt(req.params.page);
    if (page < 1){
      res.status(400).send('Bad page index');
      return;
    }

  var q = Restaurant.find()
  var name =  parseInt(req.query.name);
  var rating = parseInt(req.query.rating);
  var price = parseInt(req.query.price);
  var quantPages = parseInt(req.query.quant) || 10;

  if (name) {
    q = q.sort({name: name});
  } else if (rating && price){
    q = q.sort({rating: rating, price: price});
  } else if (rating && (!price)){
    q = q.sort({rating: rating});
  } else if ((!rating) && price){
    q = q.sort({price: price});
  }

  // if (name && (name !== req.session.sortName)) {
  //   q = q.sort({name: name});
  // } else if ((rating && (rating !== req.session.sortRating) && 
  //   (price && (price !== price.session.sortPrice)))){
  //   q = q.sort({rating: rating, price: price});
  // } else if ((rating && (rating !== req.session.sortRating)) && (!parseInt(req.query.price))){
  //   q = q.sort({rating: rating});
  // } else if ((!parseInt(rating)) && (price !== price.session.sortPrice)){
  //   q = q.sort({price: price});
  // }

  q.skip(10*(page-1))
  .limit(11)
  .exec(function(error, restaurants){
    if (error){
      res.status(400).send(error);
      return;
    }
    var restLength = restaurants.length;
    var displayRestaurants = restaurants.splice(0, 10);
    var pageTotal = [];
    Restaurant.count(function(error, totalRestaurants){
      if (error){
        res.status(400).send(error);
        return;
      }
      var pageNum = Math.floor((totalRestaurants/ 10));
      if(totalRestaurants % 10) pageNum++;
      for (var i = 1; i <= pageNum; i++){
        pageTotal.push(i);
      }
      res.render('restaurants', {
        restaurants: displayRestaurants,
        page: page,
        prev: page - 1,
        next: page + 1,
        hasNext: restLength === 11,
        pageTotal: pageTotal
      });
    });
  })
});

// router.get('/restaurants/list/:page', function(req, res, next){

//   var page = parseInt(req.params.page);
//   if (page < 1){
//     res.status(400).send('Bad page index');
//     return;
//   }

//   var q = Restaurant.find()
//     var name = parseInt(req.query.name);
//     var rating = parseInt(req.query.rating);
//     var price = parseInt(req.query.price);
//     if (name) {
//       q = q.sort({name: name});
//     } else if (rating && price){
//       q = q.sort({rating: rating, price: price});
//     } else if (rating && (!price)){
//       q = q.sort({rating: rating});
//     } else if ((!rating) && price){
//       q = q.sort({price: price});
//     }

//   // Restaurant.findNextTen(page, function(error, restaurants){
//   //   if (error){
//   //     res.status(400).send(error);
//   //     return;
//   //   }
//     var restLength = restaurants.length;
//     var displayRestaurants = restaurants.splice(0, 9);
//     var pageTotal = [];
//     Restaurant.count(function(error, totalRestaurants){
//       if (error){
//         res.status(400).send(error);
//         return;
//       }
//       var pageNum = Math.floor((totalRestaurants/ 10));
//       if(totalRestaurants % 10) pageNum++;
//       for (var i = 1; i <= pageNum; i++){
//         pageTotal.push(i);
//       }
//       res.render('restaurants', {
//         restaurants: displayRestaurants,
//         page: page,
//         prev: page - 1,
//         next: page + 1,
//         hasNext: restLength === 11,
//         pageTotal: pageTotal
//       });
//     });
//   // });
// });

router.get('/restaurants/new', function(req, res, next){
  res.render('newRestaurant');
});

router.post('/restaurants/new', function(req, res, next) {

  // Geocoding - uncomment these lines when the README prompts you to!
  geocoder.geocode(req.body.address, function(err1, data) {
    //error check
    var r = new Restaurant({
      name: req.body.name,
      category: req.body.category,
      latitude: data[0].latitude,
      longitude: data[0].longitude,
      price: req.body.price,
      opentime: parseInt(req.body.opentime),
      closetime: parseInt(req.body.closetime),
      totalScore: 0,
      reviewCount: 0,
      rating: 0
    }).save(function(err2, user){
        if(err2){
          return res.status(400).render('error', {
          message: error
        });
      }
      res.redirect('/restaurants');
    })
  });
});

router.get('/restaurants/:id', function(req, res, next){
  Restaurant.findById(req.params.id, function(error, restaurant){
    if(error){
          return res.status(400).render('error', {
          message: error
        });
    }
    restaurant.getReviews(restaurant._id, function(error, reviews){
      if(error){
            return res.status(400).render('error', {
            message: error
          });
      }
      res.render('singleRestaurant', {
        restaurant: restaurant,
        reviews: reviews
      });
    });
  });
});

router.get('/restaurants/:id/review', function(req, res, next){
  res.render('newReview');
});

router.post('/restaurants/:id/review', function(req, res, next){
  Restaurant.findById(req.params.id, function(error, restaurant){
    if(error){
      return res.status(400).render('error', {
      message: error
      });
    }
    if(!req.body.content){
      return res.redirect('/restaurants/:id/review');
    }
    restaurant.totalScore += req.body.stars;
    restaurant.reviewCount++;
    var r = new Review({
      content: req.body.content,
      stars: parseInt(req.body.stars),
      restaurantId: req.params.id,
      userId: req.user._id
    }).save(function(error, review){
      if(error){
        return res.status(400).render('error', {
        message: error
        });
      }
      res.redirect('/restaurants/' + restaurant._id);
    });
  });
});

module.exports = router;