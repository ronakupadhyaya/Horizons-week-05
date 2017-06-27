import express from 'express';
var router = express.Router();
import models from '../models/models';
var User = models.User

module.exports = function(passport) {
  // Add Passport-related auth routes here, to the router!
  // YOUR CODE HERE
  //first route that gets hit

  router.get('/', function(req, res){
    if(req.user){
      //if logged in go to contacts
      res.redirect('/contacts')
    }
    //otherwise go to login
    res.redirect('/login')
  })

  //get signup form
  router.get('/signup', function(req, res){
    res.render('signup')
  })

  router.post('/signup', function(req, res){
    //form validation
    req.checkBody('username', 'Invalid username').notEmpty();
    req.checkBody('password', 'Invalid password').notEmpty();
    req.checkBody('passwordRepeat', 'Invalid repeat password').notEmpty().equals(req.body.password);
    var errors = req.validationErrors();

    if(errors){
      //return signup with form inputs and errors
      res.render('signup',{
        username: req.body.username,
        password: req.body.password,
        passwordRepeat: req.body.passwordRepeat,
        errors: errors,
      })
    } else{

      //creating new user object with two fields
      var newUser = new User({
        username: req.body.username,
        password: req.body.password,
      });

      //save new user to mongodb
      newUser.save(function(err, user) {
      if (err) {
        //error in saving
        console.log(err);
        res.status(500).redirect('/signup');
        return;
      }else{
          //redirect to login
          console.log(user);
          res.redirect('/login');
        }
      });
    }
  })

  //render login
  router.get('/login', function(req, res){
    res.render('login')
  })

  //login passport validation
  router.post('/login', passport.authenticate('local', {
    successRedirect: '/contacts',
    failureRedirect: '/login'
  }))

  //get logout route
  router.get('/logout', function(req, res){
    //gets rid of session
    req.session.destroy(function (err) {
      res.redirect('/login');
    })
  })

  return router;
}
