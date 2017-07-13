import express from 'express';
var router = express.Router();
import Models from '../models/models'
var User = Models.User

/* GET home page. */
module.exports = function(passport) {
  router.get('/', function(req, res, next) {
    res.render('index', { title: 'Express' });
  });

  router.get('/login', function(req, res) {
    res.render('login');
  });

  router.post('/login', passport.authenticate('local', {
    successRedirect: '/products',
    failureRedirect: '/login'
  }))

  router.get('/signup', function(req, res) {
    res.render('signup')
  })

  router.post('/signup', function(req, res){
    console.log(req.body)
    if (!req.body.username || !req.body.password || !req.body.rpassword || req.body.password !== req.body.rpassword) {
      res.redirect('/signup')
    }
    else {
      console.log('im here')
      var newUser = new User({
        username: req.body.username,
        password: req.body.password
      })
      newUser.save(function(err, user) {
        if (err) {
          console.log("error saving user")
        }
        else {
          console.log('user saved!:' + user)
          res.redirect('/login')
        }
      })
    }
  })

  router.get('/logout', function(req, res) {
    res.logout()
    res.redirect('/login')
  })


  return router;
}
