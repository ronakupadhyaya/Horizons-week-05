import express from 'express';
var router = express.Router();
import models from '../models/models.js';
var User = models.User
import crypto from 'crypto'

function hashPassword(password){
  var hash = crypto.createHash('sha256');
  hash.update(password);
  return hash.digest('hex');
}

export default function(passport) {

router.get('/signup', function(req, res){
  res.render('signup')
})

//Creates new user and stores in Database
router.post('/signup', function(req, res){
  // req.checkBody('username', 'Invalid username').notEmpty();
  // req.checkBody('password', 'No password provided').notEmpty();
  // var errArray = req.validationErrors();
  // if(!errArray){
    console.log('Post /signup creating new user')
     var newUser = new User({
      username: req.body.username,
      //hashedPassword: hashPassword(req.body.password),
      password: req.body.password,
      phone:req.body.phone
    })
    console.log("Printing in auth.js", newUser)
  // }
  newUser.save().then(function(usr){

      res.redirect('/login')

  });
});
//Sends HBS File with login form
router.get('/login', function(req, res){
  res.render('login')
});
//Calls Passport authenticate, creates a session (using express sessions),
//creates req.session, serializes user, creates req.user, and redirects to home if all is successful.
// Refer to app.js - LocalStrategy, serialize, deserialze
router.post('/login', passport.authenticate('local', { successRedirect: '/',
                                   failureRedirect: '/login' }));

router.get('/logout', function(req, res){
  req.logout();
  res.redirect('/login')
});
  return router;
}
