import express from 'express'
import expressValidator from 'express-validator'
import models from '../models/models'
import passportLocal from 'passport-local'
var User = models.User
var router = express.Router();
var app = express();

module.exports = function(passport) {

  router.get('/', function(req, res) {
    if(!req.user) {
      res.redirect('/login')
    }
    else {
      res.redirect('/dashboard')
    }
  })

  router.get('/signup', function(req, res) {
    res.render('signup')
  })

  router.post('/signup', function(req, res) {
    if((req.body.username && req.body.password) && req.body.passwordRepeat) {
      if(req.body.password === req.body.passwordRepeat) {
        var newUser = new User({
          username: req.body.username,
          password: req.body.password
        })
        newUser.save(function(err, user) {
          if(err) {
            console.log('cannot save user', err)
          }
          else {
            res.redirect('/login')
          }
        })
      }
    }
  })

  router.get('/login', function(req, res) {
    res.render('login')
  })

  router.post('/login', passport.authenticate('local'), function(req, res) {
    if(req.user) {
      req.session.cart = []
      res.redirect('/dashboard')
    }
    else {
      res.redirect('/login')
    }
  })



  router.get('/logout', function(req, res) {
    req.logout();
    res.redirect('/login')
  })

  return router;
}
