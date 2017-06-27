import express from 'express';
var router = express.Router();
import models from '../models/models';


export default function(passport) {

//GIVE USER REGISTRATION PAGE
router.get('/signup', function(req, res) {
  console.log("test")
  res.render('signup')
})

//VALIDATION
var validateReq = function(userData) {
  var check = true
  if (userData.password !== userData.passwordRepeat) {
    check = false
  }
  return check
};

//SIGNUP NORMAL
router.post('/signup', function(req, res) {
  if (!validateReq(req.body)) {
    return res.render('signup', {
      error: "Passwords don't match."
    });
  }
  var newUser = new models.User({
    username: req.body.username,
    password: req.body.password,
  });

  newUser.save()
  .then(newUser => {
    res.redirect('/login')
  })
  .catch(err => {
    console.log(err)
  })
})

  router.get('/login', function(req, res) {
    res.render('login');
  });

  router.post('/login', passport.authenticate('local', {successRedirect: '/products', failureRedirect: '/login'}))

  router.get('/logout', function(req, res) {
    req.logout();
    res.redirect('/login');
  });




return router;
}
