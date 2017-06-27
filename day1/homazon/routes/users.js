import express from 'express';
var router = express.Router();
import {User} from '../models/models';
import {Product} from '../models/models';
import passport from 'passport';
import validator from 'express-validator';
router.use(validator());
import mongoose from 'mongoose';

mongoose.Promise = global.Promise;

// import products from '../seed/products.json'
// var productPromises = products.map((product) => (new Product(product).save()));
// Promise.all(productPromises)
//   .then(() => (console.log('Success. Created products!')))
//   .catch((err) => (console.log('Error', err)))

/* GET users listing. */

router.get('/login', function(req, res) {
  res.render('login')
})

router.get('/signup', function(req, res) {
  res.render('signup')
})

router.get('/logout', function(req, res) {
  req.logout();
  res.redirect('/login')
})

router.post('/signup', function(req, res, next) {
    req.checkBody('username', "Username can't be empty").notEmpty();
    req.checkBody('password', "Password can't be empty").notEmpty();
    req.assert('passwordRepeat', "Repeat password must equal password").equals(req.body.password);

    var errors = req.validationErrors();
    if (errors) {
      res.redirect('/signup');
    } else {
      var newuser = new User({
        username: req.body.username,
        password: req.body.password
      })
      newuser.save(function(err, user) {
        if (err) {
          console.log(err);
        } else {
          res.redirect('/login');
        }
      })
    }
  });

  router.post('/login', passport.authenticate('local', {
    successRedirect: '/',
    failureRedirect: '/login'
  }));


// product


export default router;
