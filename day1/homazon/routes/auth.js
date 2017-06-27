import express from 'express';
var router = express.Router();
import {User} from '../models/models.js'


export default function(passport){

  //get signup page
  router.get('/signup', (req, res) => {
    res.render('signup')
  })

  //post from sign up page with validation
  router.post('/signup', (req, res) => {
    //form validation
    req.checkBody('username', 'Invalid username').notEmpty();
    req.checkBody('password', 'Invalid password').notEmpty();
    req.checkBody('passwordRepeat', 'Invalid repeat password').notEmpty().equals(req.body.password);
    var errors = req.validationErrors()

    if(errors){
      //return signup with form inputs and errors
      res.render('signup',{
        username: req.body.username,
        password: req.body.password,
        passwordRepeat: req.body.passwordRepeat,
        errors: errors,
      })
    } else{
      //new user object
      var newUser = new User({
        username: req.body.username,
        password: req.body.password,
      })
      //save to user db
      newUser.save(function(err, user){
        if(err){console.log('error in saving user', err)}
        else{
          res.redirect('/login')
        }
      })
    }
  })

  //get login page
  router.get('/login', (req,res) => {
    res.render('login')
  })

  //post login router
  router.post('/login', passport.authenticate('local', {
    successRedirect: '/',
    failureRedirect: '/login'
  }))

  //logout
  router.get('/logout', (req, res) => {
    req.session.destroy(function(err){
      res.redirect('/')
    })
  })

  return router
};
