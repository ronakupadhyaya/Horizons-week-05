import express from 'express'
var router = express.Router()
import {User} from '../models/models'

var authRouter = function(passport) {
  router.get('/signup', function(req,res) {
    res.render('signup')
  })

router.post('/signup', function(req,res) {
  req.checkBody('username', 'username cannot be empty').notEmpty()
  req.checkBody('password', 'you need a password bro').notEmpty()
  var errors = req.validationErrors();

  if (errors) {
    res.render('signup', {
      username: req.body.username,
      password: req.body.password,
      errors: errrors
    })
  } else {
      var newUser = new User({
        username: req.body.username,
        password: req.body.password
      })
      newUser.save(function(err) {
        if (err) {
          console.log('Saving Error')
        } else {
          console.log('Success, new user created')
        }
        res.redirect('/login')
      })
    }
  })


  router.get('/login', function(req,res){
    res.render('login')
  })

  router.post('/login', passport.authenticate('local',{
    failureRedirect: '/login',
    successRedirect: '/'
  })) //COME BACK TO successRedirect

  router.get('/logout', function(req,res) {
    req.logout()
    res.redirect('/login')
  })

  return router;
}


export default authRouter
