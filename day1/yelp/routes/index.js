var express = require('express');
var router = express.Router();
var models = require('../models/models');
var User = models.User;
var Follow = models.Follow;
var Restaurant = models.Restaurant;
var Review = models.Review;



router.get('/restaurant/new', function(req,res){
  res.render('newRestaurant')
});

router.get('/restaurants', function(req,res){
  Restaurant.find(function(err,rest){
    if(err) console.log(err)
    else{
      res.render('restaurants',{rest})
    }
  })
})

router.get('/restaurant/:id',function(req,res){
  Restaurant.findById(req.params.id, function(err,rest){
    if(err) console.log(err)
    else{
      rest.getReviews(function(err,out){
        if(err){
          console.log(err)
        }
        else{
          console.log(out)
        out.find(function(){
          var count=0;
          for(var i=0; i<out.length; i++){
            count+=out[i].stars
          }
          var avg= count/out.length;
          res.render('singleRestaurant',{
          rest,
          out,
          avg
        })
        })
        }
      })
    }
  })
})

//below the wall=authenticated: 
// Geocoding - uncomment these lines when the README prompts you to!
var NodeGeocoder = require('node-geocoder');
var geocoder = NodeGeocoder({
  provider: "google",
  apiKey: process.env.GEOCODING_API_KEY || "AIzaSyCKIt8l4B_Lzbkmf1H9D5O0a0jpivtL-l4",
  httpAdapter: "https",
  formatter: null
});

//example to demonstrate what geocode data looks like when output
// router.post('/loc', function(req.res){
//   geocoder.geocode(req.body.address, function(err,data){
//     console.log(err);
//     res.send(data)
//   }
// })

// THE WALL - anything routes below this are protected!
router.use(function(req, res, next){
  if (!req.user) {
    res.redirect('/login');
  } else {
    return next();
  }
});

router.get('/review/new/:id', function(req,res){
  if(!req.user){
    res.redirect('/login')
  }
  else{
    res.render('newReview')
  }
})

router.post('/review/new/:id', function(req,res){
  var rev = new Review({
    content: req.body.content,
    stars: req.body.stars,
    userId: req.user.id,
    restaurantId: req.params.id
  })
  rev.save(function(err){
    if(err){
      console.log(err)
    }
    else{
      res.redirect('/restaurant/'+req.params.id)
    }
  })
})

//only really need next with routes handler so that next will allow for you to reach
//more routes later down the line
router.post('/restaurant/new', function(req, res, next) {

  // Geocoding - uncomment these lines when the README prompts you to!
  geocoder.geocode(req.body.address, function(err, salmon) {
    //console.log(err);
    //console.log(salmon[0]);
    var rest = new Restaurant({
    name: req.body.name,
    category: req.body.category,
    price: req.body.price,
    openTime: req.body.openTime,
    closingTime: req.body.closeTime,
    location: {
      latitude: salmon[0].latitude,
      longitude: salmon[0].longitude
    },
    address: salmon[0].formattedAddress
  })
  rest.save(function(err,r){
    if(err){
      console.log(err)
      return
    }
    res.redirect('/restaurants')
  })
  
  });
});

router.get('/', function(req,res){
  res.redirect('restaurants')
})

router.get('/profiles', function(req,res){
  User.find(function(err,users){
    if(users){
    res.render('profiles', {
      users: users
    })
  }
  }); 
})

router.get('/singleProfile/:id', function(req,res){
  // router.get('/profile/:id',function(req,res){
  User.findById(req.params.id,function(err,user){
   user.getFollows(function(following,followers){
    console.log(following)
    user.isFollowing(req.params.id,function(result){
      res.render('singleProfile',{
        user: user,
        following: following,
        followers: followers,
        amIAlreadyFollowing: result
         })
      })
    })
  })
})

// router.get('/users', function(req,res,next){
//   User.find(function(err,users){
//     if(err) return next(err);
//     res.render('users', {
//       users: users
//     })
//   })
// })

router.post('/profile/:id/follow', function(req,res){
  // res.redirect('/singleProfile/'+req.params.id)
  req.user.follow(req.params.id, function(){
    res.redirect('/singleProfile/'+req.params.id)
  })
})

router.post('/profile/:id/unfollow', function(req,res){
  // res.redirect('/singleProfile/'+req.params.id)
  req.user.unfollow(req.params.id, function(){
    res.redirect('/singleProfile/'+req.params.id)
  })
})




module.exports = router;