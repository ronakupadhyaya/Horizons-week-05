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
   apiKey: "AIzaSyBDFuV47Kmc9iWJeDM4BZIl44k7QYCLDGs",
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

router.get('/user/:id', function(req, res, next){

	User.findById(req.params.id, function(error, user){
		user.getFollowers(function(followers, following){
			
			
			res.render('singleProfile', {
				following: following,
				followers: followers,
				displayName: user.displayName,
				email: user.email
			})
			
		})
	})
	
})

router.get('/restaurants/new', function(req, res, next){
	res.render('newRestaurant');
})
router.post('/user/:id', function(req, res, next){
	User.findById(req.user.id, function(error, user){
		user.isFollowing(req.params.id, function(value){
			if(value === false){
				user.follow(req.params.id, function(ret){
					res.redirect('/user/' + req.params.id)
				})
			}
		})
	})
	
})

router.get('/profiles', function(req, res, next){
	
	User.find({},function(error, users){
		res.render('profiles', {
			length: users.length,
			users: users
		})
	})
})

router.get('/restaurants', function(req, res, next){
	
	Restaurant.find({}, function(error, restuarants){
		res.render('restaurants', {
			rest: restuarants
		})
	})
})

router.get('/restaurants/:id', function(req, res, next){
	
	Restaurant.findById(req.params.id, function(error, restuarant){
		res.render('singleRestaurant', {
			name: restuarant.name,
			category: restuarant.category,
			price: restuarant.price,
			open: restuarant.openTime,
			close: restuarant.closeTime,
			latitude: restuarant.latitude,
			longitude: restuarant.longitude
		})
	})
})
router.post('/restaurants/new', function(req, res, next) {

 
   geocoder.geocode(req.body.address, function(err, data) {
     if(err){
		 res.redirect('/restaurants/new');
		 console.log(err);
	 } else {
	 console.log(req.body.openTime);
      var restuarant = new models.Restaurant({
	   name: req.body.name,
		category: req.body.category,
		  price: req.body.price,
		  latitude: data[0].latitude,
		  longitude: data[0].longitude,
		  openTime: String(req.body.openTime),
		  closeTime: String(req.body.closeTime)
		
  		});
		 
	restuarant.save(function(error, success){
		if(error){
			console.log(error);
		}
		else {
			console.log(success);
			res.redirect('/restaurants/' + success._id);
		}
	});
   	}
   });
});

module.exports = router;