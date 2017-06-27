import express from 'express';
import session from 'express-session';
import passport from 'passport';
import LocalStrategy from 'passport-local';
var router = express.Router();
import models from '../models/models'
import {User, Product} from '../models/models';


module.exports = function(passport){
  //implement a route to GET the register(signup) page
  router.get('/signup', function(req, res){
    res.render('signup');
  });
  //implement a route to POST registration data to
  router.post('/signup', function(req, res) {
    // validation step
    // if (!validateReq(req.body)) {
    //   return res.render('signup', {
    //     error: "Passwords don't match."
    //   });
    // }
    var user = new User({
      username: req.body.username,
      password: req.body.password
    });
    user.save(function(err, user) {
      if (err) {
        console.log(err);
        res.status(500).redirect('/register');
        return;
      }
      console.log(user);
      res.redirect('/login');
    });
  });

  // implement a route to GET the login page
  router.get('/login', function(req, res) {
    res.render('login');
  });

  // implement a route to POST login data to
  router.post('/login', passport.authenticate('local'), function(req, res) {
    req.session.cart = [];
    res.redirect('/');
  });

  // implement a route to GET the logout page
  router.get('/logout', function(req, res) {
    req.logout();
    res.redirect('/login');
  });


  return router;
}
