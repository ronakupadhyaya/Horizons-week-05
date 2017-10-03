import bcrypt from 'bcrypt';
import express from 'express';
const router = express.Router();

import mongoose from 'mongoose';
mongoose.Promise = global.Promise;

const saltRounds = 10;
import models from '../models/models';
const User = models.User;

export default function(passport) {
  router.get('/signup', function(req, res, next) {
    res.render('signup', {
      signupErrors: req.flash('signupError'),
    });
  });

  router.post('/signup', function(req, res, next) {
    if(!req.body.username || !req.body.password) {
      req.flash('signupError', 'Both username and password are required!');
      res.redirect('/signup');
    } else if(req.body.password !== req.body.passwordRepeat) {
      req.flash('signupError', "Your passwords don't match!");
      res.redirect('/signup');
    } else {
      User.findOne( { username: req.body.username } )
        .exec()
        .then(function(user) {
          if(user) {
            req.flash('signupError', 'A user exists with that username already!');
            res.redirect('/signup');
          } else {
            bcrypt.hash(req.body.password, saltRounds)
              .then(function(hash) {
                let newUser = {
                  username: req.body.username,
                  password: hash,
                };
                return User.create(newUser);
              })
              .then( () => {
                res.redirect('/login');
              })
              .catch(function(err) {
                next(err);
              });
          }
        })
        .catch(function(err) {
          next(err);
        });
    }
  });

  router.get('/login', function(req, res, next) {
    res.render('login', {
      errors: req.flash('error'),
    });
  });

  router.post('/login', passport.authenticate('local', {
    failureRedirect: '/login',
    failureFlash: true,
  }),
  (req, res) => {res.redirect('/');}
  );

  router.get('/logout', function(req, res) {
    req.logout();
    res.redirect('/login');
  });

  return router;
}
