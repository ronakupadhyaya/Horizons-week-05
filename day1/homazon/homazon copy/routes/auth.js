import express from 'express';
import models from '../models/models.js';
var User = models.User;

var router = express.Router();

var auth = function(passport) {
  // Add Passport-related auth routes here, to the router!

  //
  // app.get('/login', (req,res) => {
  //   res.render('login');
  // });
  //
  // app.post('/login', (req,res) => {
  //   res.send(req.body);
  // })

  // GET Login page
  router.get('/login', function(req, res) {
    res.render('login');
  });

  // POST Login page
  router.post('/login', passport.authenticate('local', {
    successRedirect: '/',
    failureRedirect: '/login'
  }));

  // GET registration page
  router.get('/signup', (req, res) => {
    res.render('signup');
  });

  // POST registration page
  var validateReq = function(userData) {
    if (userData.password !== userData.passwordRepeat) {
      return "Passwords don't match.";
    }

    if (!userData.username) {
      return "Please enter a username.";
    }

    if (!userData.password) {
      return "Please enter a password.";
    }
  };

  router.post('/signup', (req, res) => {
    // validation step
    var error = validateReq(req.body);
    if (error) {
      return res.render('signup', {
        error: error
      });
    }
    var newUser = new User(req.body);
    // var u = new models.User({
    //   username: req.body.username,
    //   password: req.body.password,
    // });

    //promise version of a mongoose save. save is async

    // TODO check password matches repeat
    newUser.save()
      .then(() => {
        res.redirect("/login")
      })
      .catch((err)=> {
        console.log(err);
        res.send("error!");
      })
    // u.save(function(err, user) {
    //   if (err) {
    //     console.log(err);
    //     res.status(500).redirect('/signup');
    //     return;
    //   }
    //   console.log("Saved User: ", user);
    //   res.redirect('/login');
    // });
  });

  router.get('/logout', function(req, res){
    req.logout();
    res.redirect('/login');
  });

  return router;
}

export default auth
