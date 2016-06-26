var express = require('express');
var accountSid = process.env.ACCOUNT_SID;
var authToken = process.env.AUTH_TOKEN;
var fromPhone = process.env.FROM_PHONE;
var router = express.Router();
var models = require('../models/models');
var Contact = models.Contact;
var Message = models.Message;
var User = models.User;
var Follow = models.Follow;
var Restaurant = models.Restaurant;
var Review = models.Review;

router.post('/messages/receive', function(req, res, next) {
  User.findOne({phone: fromPhone.substring(2)}, function(err, user) {
    Contact.findOne({phone: req.body.From.substring(2)}, function(err, contact) {
      console.log(user, contact);
      if(err) return next(err);
      var message = new Message({
        created: new Date(),
        content: req.body.Body,
        user: user._id,
        contact: contact._id
      });
      message.save(function(err) {
        if(err) return next(err);
        res.send("Thanks Twilio <3");
      });
    })
  });
});

router.use(function(req, res, next){
  if (!req.user) {
    res.redirect('/login');
  } else {
    return next();
  }
});

////////////////////////MEINE

router.get('/users', function(req, res, next) {
  User.find(function(err, users) {
    if (err) return next(err);
    res.render('users', {
      users: users
    });
  });
});

router.get('/profile', function(req, res) {
  User.findById(req.user.id, function(err, user) {
    if (err) return next(err);
    res.render('profile', {
      user: user
    });
  });
});



router.get('/profile/:id', function(req, res) {
  User.findById(req.params.id, function(err, user) {
    if (err) return next(err);
    user.getFollowers(user,function(err, followers, following) {
      if (err) return next(err);
      res.render('profile', {
        user: user,
        following: following,
        followers: followers
      });
    })
  });
});

// TODO: Add /unfollow/:id

router.post('/follow/:id', function(req, res, next) {
  user.follow(userid, function(err) {
    if (err) return next(err);
    //  res.redirect('/profile');
    // TODO: Confirm following
  });
});


router.get('/restaurants/new', function(req, res, next) {
  res.render('editRestaurant');
});

router.post('/restaurants/new', function(req, res, next) {
  var restaurant = new Restaurant({
    name: req.body.name,
    price: parseInt(req.body.price),
    category: req.body.category,
    openHoursEST: {
      openTime: parseInt(req.body.openTime),
      closingTime: parseInt(req.body.closingTime)
    }
  });
  restaurant.save(function(err) {
    if (err) return next(err);
    res.redirect('/restaurants');
  })
});


router.get('/restaurants', function(req, res, next) {
  Restaurant.find(function(err, restaurants) {
    if (err) return next(err);
    //  console.log(restaurants)
    res.render('restaurants', {
      restaurants: restaurants
    });
  });
});

router.get('/restaurants/:id', function(req, res) {
  Restaurant.findById(req.params.id, function(err, restaurant) {
    if (err) return next(err);

    restaurant.getReviews(req.params.id, function(err, reviews) {
      if (err) return next(err);
      console.log(reviews)
      res.render('restaurant', {
        restaurant:restaurant,
        reviews:reviews
      });
    });

  });
});

router.post('/restaurants/:id', function(req, res, next) {
  var review = new Review({
    stars: req.body.stars,
    content: req.body.content,
    restaurant: req.params.id,
    user:  req.user.id
  });
  review.save(function(err) {
    if (err) return next(err);
    res.redirect('/restaurants/'+req.params.id);
  })
});

////////////////////////
////////////////////////
////////////////////////

/* GET home page. */
router.get('/contacts', function(req, res, next) {
  // Load all contacts (that this user has permission to view).
  Contact.find(function(err, contacts) {
    if (err) return next(err);
    res.render('contacts', {
      contacts: contacts
    });
  });
});

router.get('/contacts/new', function(req, res, next) {
  res.render('editContact');
});

router.get('/contacts/:id', function(req, res) {
  Contact.findById(req.params.id, function(err, contact) {
    if (err) return next(err);
    res.render('editContact', {
      contact: contact
    });
  });
});

router.post('/contacts/new', function(req, res, next) {
  var contact = new Contact({
    name: req.body.name,
    phone: req.body.phone
  });
  contact.save(function(err) {
    if (err) return next(err);
    res.redirect('/contacts');
  })
});

router.post('/contacts/:id', function(req, res, next) {
  Contact.findById(req.params.id, function(err, contact) {
    if (err) return next(err);
    contact.name = req.body.name;
    contact.phone = req.body.phone;
    contact.save(function(err) {
      if (err) return next(err);
      res.redirect('/contacts');
    });
  });
});

router.get('/messages', function(req, res, next) {
  Message.find({user: req.user._id}, function(err, messages) {
    if (err) return next(err);
    res.render('messages', {
      messages: messages
    });
  });
});

router.get('/messages/:id', function(req, res, next) {
  Contact.findById(req.params.id, function(err, contact) {
    if (err) return next(err);
    Message.find({user: req.user._id, contact: req.params.id}, function(err, messages) {
      if (err) return next(err);
      res.render('messages', {
        messages: messages,
        contact: contact
      });
    });
  });

});

router.get('/messages/send/:id', function(req, res, next) {
  Contact.findById(req.params.id, function(err, contact) {
    res.render('newMessage', {
      contact: contact
    });
  });
});

router.post('/messages/send/:id', function(req, res, next) {
  Contact.findById(req.params.id, function(err, contact) {
    if (err) return next(err);
    twilio.messages.create({
      to: "+1" + contact.phone,
      from: fromPhone,
      body: req.body.message
    }, function(err, message) {
      if (err) return next(err);
      var message = new Message({
        created: new Date(),
        content: req.body.message,
        user: req.user._id,
        contact: contact._id
      });
      message.save(function(err) {
        if(err) return next(err);
        res.redirect('/messages/' + req.params.id)
      });
    })
  });
});

module.exports = router;
