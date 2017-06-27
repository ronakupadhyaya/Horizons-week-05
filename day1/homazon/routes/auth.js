import express from 'express';
import models from '../models/models.js';
var User = models.User;

var router = express.Router();

var auth = function(passport) {
 // Add Passport-related auth routes here, to the router!

 // GET Login page
 router.get('/login', function(req, res) {
   res.render('login');
 });

 // POST Login page
 router.post('/login', passport.authenticate('local', {
   successRedirect: '/products',
   failureRedirect: '/login'
 }));

 // GET registration page
 router.get('/signup', function(req, res) {
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

 router.post('/signup', function(req, res) {
   // validation step
   var error = validateReq(req.body);
   if (error) {
     return res.render('signup', {
       error: error
     });
   }
   var u = new models.User({
     username: req.body.username,
     password: req.body.password,
   });
   u.save(function(err, user) {
     if (err) {
       console.log(err);
       res.status(500).redirect('/signup');
       return;
     }
     console.log("Saved User: ", user);
     res.redirect('/login');
   });
 });

 router.get('/logout', function(req, res){
   req.logout();
   res.redirect('/login');
 });

 return router;
}

export default auth
// import express from 'express';
// import mongoose from 'mongoose';
// import models from '../models/models';
//
// var router = express.Router();
// var User = models.User;
//
// // sign up page
// var auth = function (passport) {
//   router.get('/signup', (req, res) => {
//     res.render('signup')
//   })
//
//   router.post('/signup', (req, res) => {
//     var newUser = new User({
//       username: req.body.username,
//       password: req.body.password
//     })
//     newUser.save((err, user) => {
//       if (err) {
//         console.log('boo ho', err);
//       } else {
//         res.redirect('/login')
//       }
//     })
//     // .then((user) => {
//     //   res.redirect('login');
//     // })
//     // .catch((err) => {
//     //   return done(err);
//     // })
//   })
//
//   // logging in
//
//   router.get('/login', (req, res) => {
//     res.render('login');
//   });
//
//   router.post('/login', passport.authenticate('local', {
//     successRedirect: '/products',
//     failureRedirect: '/login'
//   }));
//
//   router.get('/logout', (req, res) => {
//     req.logout();
//     res.redirect('/login');
//   });
//   return router;
// }
//
// export default auth;
