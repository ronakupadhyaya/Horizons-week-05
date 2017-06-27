import express from 'express';
import passport from 'passport';
import {Strategy as LocalStrategy} from 'passport-local';
import models from '../models/models';
import mongoose from 'mongoose';
mongoose.Promise = global.Promise;

import {User} from '../models/models'
var router = express.Router();

passport.use(new LocalStrategy(
  function(username, password, done) {
    //console.log(username, password);
    User.findOne({ username: username }, function (err, user) {
      if (err) { return done(err); }
      if (!user) { return done(null, false); }
      if(user.password === password) {
          return done(null, user);
      } else {
        return done(null, false)
      }

    });
  }
));

passport.serializeUser((user, done) => {
  done(null, user._id);
});

passport.deserializeUser((id, done) => {
  User.findById(id, (err, user) => {
    done(err, user);
  });
});

router.get('/signup', function(req, res) {
  res.render('signup');
});

router.post('/signup', function(req, res) {
  //account validation
  // if(req.body.username.length < 1) {
  //   res.redirect('/signup')
  // }
  //
  // if(req.body.password !== req.body.password_confirm) {
  //   res.redirect('/signup')
  // }

  var newUser = new User({
    username: req.body.username,
    password: req.body.password
  })

  newUser.save()
  .then((response) => {
    console.log(response);
  })
})

router.get('/login', function(req, res) {
  res.render('login');
});

router.get('/logout', function(req, res) {
  req.logout();
  res.redirect('/');
});

router.post('/login', passport.authenticate('local', {
  successRedirect: '/',
  failureRedirect: '/login',
}));

export default router;
