import express from 'express';
var router = express.Router();
import mongoose from 'mongoose';
import {User, Product} from '../models/models'
import validator from 'express-validator';
import products from '../../seed/products.json'

export default function(passport) {
  router.get('/signup', function(req, res) {
    // Promise.all(products.map((product) => (new Product(product).save())))
    //   .then(() => {
    //     console.log('Success. Created products!'); 
    //     res.render('signup');
    //   })
    res.render('signup');
  });

  router.post('/signup', function(req, res) {
    req.check('username', 'Username must not be empty').notEmpty();
    req.check('password', 'Password must not be empty').notEmpty();
    req.check('passwordRepeat', 'Passwords must match').equals(req.body.password); //assert possibly

    var errors = req.validationErrors();
    if (errors) {
      res.redirect('/signup');
    } else {
      var newUser = new User({
        username: req.body.username,
        password: req.body.password
      });
      newUser.save()
        .then(() => (res.redirect('/login')))
        .catch((err) => {
          res.status(500).json({error: "Database Error: /signup"});
        });
    }
  });

  router.get('/login', function(req, res) {
    console.log(req.session);
    res.render('login');
  });

  router.post('/login', passport.authenticate('local', {
      successRedirect: '/',
      failureRedirect: '/login'
    })
  );

  router.get('/logout', function(req, res) {
    req.logout();
    res.redirect('/login');
  });

  return router;
}