var express = require('express');
var router = express.Router();
import models from '../models/models';
var User = models.User;
/* GET home page. */

module.exports = function(passport) {
  router.get('/', passport.authenticate('local',{
    successRedirect: '/users',
    failureRedirect: '/login'
  }));

  router.get('/signup', function(req,res,next){
    res.render('signup');
  });

  router.post('/signup',function(req,res){
    if(!req.body.password || !req.body.username){
      res.status(400).send('Please fill in missing fields.');
    }
    else if(req.body.password!==req.body.passwordRepeat){
      res.status(400).send('Error: passwords do not match');
    }
    else{
      var newUser = new User({
        username: req.body.username,
        password: req.body.password,
      });

      newUser.save(function(err){
        if(err){
          res.error(err);
        }
        else{
          res.redirect('/login');
        }
      });
    }
  });

  router.get('/login', function(req,res,next){
    res.render('login');
  });

  router.post('/login',passport.authenticate('local',{
    successRedirect: '/users',
    failureRedirect: '/login'
  }));

  router.get('/logout',function(req,res){
    req.logout();
    res.redirect('/login');
  })
  return router;
};
