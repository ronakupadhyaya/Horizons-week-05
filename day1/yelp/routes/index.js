var express = require('express');
var router = express.Router();
var models = require('../models/models');
var User = models.User;
var Follow = models.Follow;
var Restaurant = models.Restaurant;
var Review = models.Review;

// THE WALL
router.use(function(req, res, next){
  if (!req.user) {
    res.redirect('/login');
  } else {
    return next();
  }
});

router.get('/restaurants/new', function(req, res, next) {
  res.render('editRestaurant');
});

router.post('/restaurants/new', function(req, res, next) {
  // GEOCODE SCAFFOLD HERE
});

module.exports = router;
