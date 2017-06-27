import models from '../models/models';
import express from 'express';
var router = express.Router();

export default function(passport) {
  router.get('/signup', function(req, res) {
    res.render('signup');
  });
  ///////post signup page
  var validateReq = function(userData) {
    return (userData.password === userData.passwordRepeat);
  };
  router.post('/signup', function(req, res) {

    if (req.body.username === null) {
      return res.render('sigunp', {
        error: 'Username must not be empty'
      })
    }
    if (req.body.password === null) {
      return res.render('sigunp', {
        error: 'Password must not be empty'
      })
    }
    if (!validateReq(req.body)) {
      return res.render('signup', {
        error: "Passwords don't match."
      });
    }
    var user = new models.User({
      username: req.body.username,
      password: req.body.password,
    });
    user.save()
      .then(
        (err, user) => {
          if (err) {
            console.log(err);
            res.status(500).redirect('/register');
            return;
          }
          console.log(user);
          res.redirect('/login');
        })
    // user.save(function(err, user) {


  });
  router.get('/login', function(req, res) {
    if (req.query.err) {
      res.render('login', {
        error: req.query.err
      });

    } else res.render('login');

  })
  router.post('/login', passport.authenticate('local', {
    successRedirect: '/',
    failureRedirect: '/login?err=badpassword',
    // failureFlash: true
  }))
  router.get('/logout', function(req, res) {
    req.logout(); /// terminate the current session
    res.redirect('/login');
  })


  return router;

};
