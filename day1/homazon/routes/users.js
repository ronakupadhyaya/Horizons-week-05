import express from 'express';
import {User, Product, Payment} from '../models/models';
import passport from 'passport';
var router = express.Router();

router.get('/signup', function(req, res) {
  res.render('signup');
})

router.post('/signup', function(req, res) {
  if (req.body.password !== req.body.passwordRepeat) {
    res.send('Passwords do not match');
  }
  else {
    var newUser = new User({
      username: req.body.username,
      password: req.body.password
    });
    newUser.save().then((usr) => {
      res.redirect('/login');
    });
  }
});

router.get('/login', function(req, res) {
  if (req.session.cart === undefined) {
    req.session.cart = [];
  }
  res.render('login');
});

router.post('/login', passport.authenticate('local', {
    successRedirect: '/',
    failureRedirect: '/login'
}));

router.get('/logout', function(req, res) {
  req.logout();
  res.redirect('/login');
});

export default router;
