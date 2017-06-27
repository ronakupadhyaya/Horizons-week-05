import express from 'express';
import session from 'express-session';
import models from '../models/models';
import mongoose from 'mongoose';


mongoose.Promise = global.Promise;


var MongoStore = require('connect-mongo')(session);

var router = express.Router();
var User = models.User;


module.exports =function(passport){
  router.get('/register',function(req,res){
    res.render('register');
  })

  router.post('/register',function(req,res){
    var u = new User({
      name: req.body.name,
      password: req.body.password
    });
    Promise.all([u.save()])
    .then(function(responses){
      res.redirect('/login');
    })
  })

  router.get('/login',function(req,res){
    res.render('login')
  });

  router.post('/login',passport.authenticate('local'),
  function(req,res){
    req.session.cart = [];
    res.redirect('/');
  }
    // {successRedirect: '/',
    // failureRedirect: '/login'}
  );

  router.get('/logout',function(req,res){
    req.session.destroy(function(err){
      req.logout();
      res.redirect('/login');
    })
  })

  router.use('/',function(req,res,next){
    if(!req.user){
      res.redirect('/login');
    }
    else{
      next();
    }
  })

  return router;
}
