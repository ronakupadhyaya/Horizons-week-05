var express = require('express');
var router = express.Router();
import {
  User
} from '../models/models';

export default function(passport) {
  /* GET users listing. */
  router.get('/login', (req, res) => (res.render('login')));

  router.post('/login', passport.authenticate('local'), (req, res) => {
    if (req.user) {
      res.redirect('/');
    } else {
      res.render('login', {
        error: "Invalid login credentials"
      })
    }
  })

  router.get('/signup', (req, res) => (res.render('signup')))

  router.post('/signup', (req, res) => {
    var name = req.body.username;
    var pass = req.body.password;
    var passRe = req.body.passwordRepeat;
    if (name && pass && pass === passRe) {
      var user = new User({
        username: name,
        password: pass
      });
      user.save().then(() => (res.redirect('/login'))).catch((err) => {
        res.render('signup', {
          error: err
        })
      })
    } else {
      res.render('signup', {
        error: "Invalid credentials.  Make sure that username and password are filled in and the passwords match."
      })
    }
  })

  router.get('/logout', (req, res) => {
    req.logout();
    res.redirect('/login');
  })

  return router;
}
