import express from 'express';
var router = express.Router();
import {User} from '../models/models';

var auth =function(passport){
  router.get('/signup', function(req, res) {
    res.render('signup');
  });


  // POST registration page
  var validateReq = function(userData) {
    return userData.password === userData.passwordRepeat;
  };

  router.post('/signup', function(req, res) {
    if (!validateReq(req.body)) {
      return res.render('signup', {
        error: "Passwords don't match."
      });
    }
    var u = new User({
      username: req.body.username,
      password: req.body.password,
    });
    console.log(u);

    u.save(function(err, user) {
      if (err) {
        console.log(err);
        res.status(500).redirect('/register');
        return;
      }
      //console.log(user);
      res.redirect('/login');
    });
  });

  router.get('/login',function(req,res){
    res.render('login');
  })

  router.post('/login', passport.authenticate('local'), function(req, res) {
    res.redirect('/');
  });

  router.get('/logout', function(req, res) {
    req.logout();
    res.redirect('/login');
  });

  return router;
  }


export default auth
