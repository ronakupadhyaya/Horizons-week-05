import express from 'express';
var router = express.Router();
import models from '../models/models';

export default function(passport){
  // GET registration page
    router.get('/signup', function(req, res) {
      res.render('signup');
    });

   // POST registration page
    var validateReq = function(userData) {
      return (userData.password === userData.passwordRepeat);
    };

   router.post('/signup', function(req, res) {
      // validation step
      if (!validateReq(req.body)) {
        return res.render('signup', {
          error: "Passwords don't match."
        });
      }
      var u = new models.User({
        username: req.body.username,
        password: req.body.password
      });
      console.log(u)
      u.save().then(function(resp){
        console.log(resp);
        res.redirect('/login')}
      ).catch((err)=>{console.log(err)})
    });
        // if (err) {
        //   console.log('here i amm in err');
        //   console.log(err);
        //   res.status(500).redirect('/signup');
        //   return;
        // }
        // console.log(user, 'here i am outside if');
        // res.redirect('/login');
      // });

   // GET Login page
    router.get('/login', function(req, res) {
      res.render('login');
    });

   // POST Login page
    router.post('/login', passport.authenticate('local'), function(req, res) {
      res.redirect('/');
    });

   // GET Logout page
    router.get('/logout', function(req, res) {
      req.logout();
      res.redirect('/login');
    });
    return router;
};
