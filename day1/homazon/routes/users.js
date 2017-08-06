import express from 'express';
var router = express.Router();
var User = require('../models/models').User

/* GET users listing. */
// router.get('/', function(req, res, next) {
//   res.send('respond with a resource');
// });

module.exports = function(passport){

  router.get('/addCart', function(req, res){
    req.session.cart=[];
    res.redirect('/');
  })
  router.get('/', function(req, res){
    console.log(req.user);
    if(req.user){

      res.redirect('/products');
    } else{
      res.redirect('/login');
    }
  });

  router.get('/login', function(req, res){
    res.render('login')
  });

  router.post('/login', passport.authenticate('local', {
    successRedirect: '/addCart',
    failureRedirect: '/login'
  }));

  router.get('/signup', function(req, res){
    res.render('signup');
  });

  router.post('/signup', function(req, res){
    if(req.body.password !== req.body.repeatPassword){
      console.log('Passwords don\'t match!');
      res.render('signup',{
        error: 'Passwords do not match. Try Again'
      });
    }
     else{
       User.findOne({username: req.body.username}, function(err, user){
         if(err){
           console.log('Error in finding user');
           res.rendirect('signup', err);
         } else if(user){
           console.log('User already exists!', user)
         } else{

           var newUser = new User({
             username: req.body.username,
             password: req.body.password
           });

           newUser.save().then(function(doc){
                   console.log('New User Created');
                   res.redirect('/login');
                 })
                 .catch(function(err){
                   console.log('Unable to save user');
                   res.render('signup', {
                     error: 'Failed'
                   });
                 })
         }
       })
     }
  });

  router.get('/logout', function(req, res){
    req.logout();
    res.redirect('/login');
  });


  return router;
};
