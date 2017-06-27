import express from 'express';
var router = express.Router();
import models from '../models/models';
import {User} from '../models/models';
import mongoose from 'mongoose';
mongoose.Promise = global.Promise;

export default function(passport){


  // GET registration page
    router.get('/signup', function(req, res) {
      res.render('signup');
    });

    // POST registration page
    // var validateReq = function(userData) {
    //   return (userData.password === userData.passwordRepeat);
    // };

    router.post('/signup', function(req, res) {
      // if (!validateReq(req.body)) {
      //   return res.render('signup', {
      //     error: "Passwords don't match."
      //   });
      // }
      var u = new User({
        username: req.body.username,
        password: req.body.password
      });


      u.save().then((doc) => {
        // console.log("created new user redirecting to login",doc);
        // console.log("created new user redirecting to login",user);
        res.redirect('/login');
      });

    //   u.save(function(err, user) {
    //     if (err) {
    //       console.log(err);
    //       res.status(500).redirect('/signup');
    //       // return;
    //     }
    //     console.log("created new user redirecting to login",user);
    //     res.redirect('/login');
    //   });
    });

    // GET Login page
    router.get('/login', function(req, res) {
      res.render('login');
    });



    router.post('/login', function(req, res, next) {
      passport.authenticate('local', function(err, user, info) {
        if (err) {
          return next(err);
        }
        if (!user) {
          return res.redirect('/login');
        }
        req.logIn(user, function(err) {
          if (err) {
            return next(err);
          }
          req.session.cart = [];
          return res.redirect('/');
        });

      })(req, res, next);
    });
    // POST Login page
    // router.post('/login', passport.authenticate('local', {
    //   successRedirect: '/',
    //   failureRedirect: '/login'
    // }));


    // GET Logout page
    router.get('/logout', function(req, res) {
      req.logout();
      res.redirect('/login');
    });

    return router;



}
