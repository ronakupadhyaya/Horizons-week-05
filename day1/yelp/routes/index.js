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

router.get("/restaurant/new", function(req, res){
  res.render("newRestaurant");
})


router.post("/restaurant/new", function(req, res, next){
  geocoder.geocode(req.body.location, function(err, addrs){
    console.log("HELLO ETHAN" + err)
    console.log(addrs)
  var rest = new Restaurant({
    name: req.body.name,
    category: req.body.category,
    price: req.body.price,
    openTime: req.body.openTime,
    closingTime: req.body.closingTime,
    location:{
      latitude: addrs[0].latitude,
      longitude: addrs[0].longitude,
      address: req.body.location
    }
  })
  rest.save(function(err,r){
    console.log(err);
    console.log(r);
    res.redirect("/restaurant/new")
  })
 })
})

// router.get("/restaurants", function(req, res){
//   var page = parseInt(req.query.page || 1)
//   Restaurant.find()
//             .limit(10)
//             .skip(10 * (page -1)
//             .sort({name: 1})  
//             .exec(function(err, restaurants){
//     res.render("restaurants",{
//       restaurants: restaurants,
//       page : page,
//       hasPrev: page>1,
//       prev : page - 1,
//       next : page +1
//     })
//   })
// })


// router.get("/restaurants/list/:id", function(req, res) {
//     var n = parseInt(req.params.id || 1)
//     var rating = req.query.rating
//     var name = req.query.name
//     var price = req.query.price
//     var pageArr = [];
//     Restaurant.getTen(n, function(error, restaurants){
//       var count = Restaurant.count(function(err, count){
//         var arrLength = count / 10;
//         for (var i = 1; i <= arrLength; i++){
//           pageArr.push(i)
//         }
//         if(error) return (error)
//         res.render("restaurants",{
//           restaurants: restaurants,
//           pageArr : pageArr,
//           prev : n - 1,
//           next : n +1,
//           page: n
//         });
//       })
//     });
// })    




router.get("/restaurants/list/:id", function(req, res) {
    var n = parseInt(req.params.id || 1)
    var rating = req.query.rating
    var name = req.query.name
    var price = req.query.price
    var pageArr = [];
    var query = Restaurant.find()
    if (name) {
      query = query.sort({'name': name})
    }
    if (rating) {
      query = query.sort({'rating':rating})
    }
    if(price){
      query = query.sort({'price':price})
    }
    query
              .limit(10)
              .skip((parseInt(req.params.id) - 1) * 10)
              .exec(n, function(error, restaurants){
      var count = Restaurant.count(function(err, count){
        var arrLength = count / 10;
        for (var i = 1; i <= arrLength; i++){
          pageArr.push(i)
        }
        if(error) return (error)
        res.render("restaurants",{
          restaurants: restaurants,
          pageArr : pageArr,
          prev : n - 1,
          next : n +1,
          page: n
        });
      })
    });
}) 


router.get("/restaurants", function(req, res){
    var rating = req.query.rating
    var name = req.query.name
    var price = req.query.price

    var query = Restaurant.find()

    if (name) {
      query = query.sort({'name': name})
    }
    if (rating) {
      query = query.sort({'rating':rating})
    }
    if(price){
      query = query.sort({'price':price})
    }
    query
      .limit(10)
      .exec(function(err, restaurants){
          console.log(restaurants)
          res.render("restaurants",{
              restaurants: restaurants
        })
    })

  //   if(name){
  //      Restaurant.find()
  //           .limit(10)
  //           .sort({name: name})
  //           .exec(function(err, restaurants){
  //         console.log(restaurants)
  //   res.render("restaurants",{
  //     restaurants: restaurants
  //   })
  // })
  //   }
  //   if(rating){
  //      Restaurant.find()
  //           .limit(10)
  //           .sort({rating: rating})
  //           .exec(function(err, restaurants){
  //         console.log(restaurants)
  //   res.render("restaurants",{
  //     restaurants: restaurants
  //   })
  // })
  //   }
  //   if(price){
  //      Restaurant.find()
  //           .limit(10)
  //           .sort({price: price})
  //           .exec(function(err, restaurants){
  //         console.log(restaurants)
  //   res.render("restaurants",{
  //     restaurants: restaurants
  //   })
  // })
  //   }
  //   else{
  //      Restaurant.find(function(err, restaurants){
  //         console.log(restaurants)
  //   res.render("restaurants",{
  //     restaurants: restaurants
  //   })
  // })
  //   }

// res.redirect("/restaurants/list/1")
})

router.get("/restaurants/:id", function(req, res){
  Restaurant.findById(req.params.id, function(err, restaurant){
    // console.log(restaurant);
    // console.log(restaurant.location.latitude)
    // console.log(restaurant.location.longitude)
    res.render("singleRestaurant",{
      restaurant: restaurant,
      key : process.env.GEOCODING_API_KEY,
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



router.get("/profiles", function(req, res, next){
  User.find(function(error, usersfromMongo){
    if(error){
      return next(error)
    }
  res.render("profiles",{
    users: usersfromMongo

  })
})
})


router.get("/singleProfile/:id", function(req, res, next){
    var id = req.params.id;
      User.findById(id, function(error, userfromMongo){
        if(error){
          return next(error)
        }
        userfromMongo.getFollows(function(err, follower, following){  
         if(err){
          return next(err)
         }
         res.render("singleProfile", {
          user: userfromMongo,
          address: userfromMongo.location.full,
          followers: follower,
          following: following

         })
       })
    })
})

router.post("/singleProfile/:id", function(req, res, next){
  var idToFollow = req.params.id;
  var cb = function(err, data){
    if(err){
      res.send("You are already following")
    } else {
      res.redirect("/singleProfile/" + idToFollow)
    }
  }
  req.user.follow(idToFollow, cb)
})

router.post("/unfollow/:id", function(req, res, next){
  var idToUnfollow = req.params.id;
    User.findById(req.user, function(error, user){
    user.unfollow(idToUnfollow, function(foo){
      if(!foo){
      res.send("You are already unfollowing")
    } else {
      res.redirect("/singleProfile/" + req.user._id)
    }
    })
   })
})


router.get("/", function(req, res){
  res.render("login")
})





router.post('/restaurants/new', function(req, res, next) {

  // Geocoding - uncomment these lines when the README prompts you to!
  // geocoder.geocode(req.body.address, function(err, data) {
  //   console.log(err);
  //   console.log(data);
  // });
  
});

module.exports = router;