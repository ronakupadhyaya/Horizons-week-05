import express from 'express';
var router = express.Router();
import {User} from "../models/models";
import expressValidator from 'express-validator';
router.use(expressValidator());

const func = (passport) => {
  router.get('/login',function(req,res){
    res.render('login');
  })
  router.post('/login', passport.authenticate('local',{
   successRedirect: '/',
   failureRedirect: '/login'
 }))
  router.get('/register',function(req,res){
    res.render('register')
  })
  router.post('/register',function(req,res){
    req.check('password2','password must match').matches(req.body.password);
    var errors = req.validationErrors();
    if(!errors){
      var u = new User({
        username: req.body.username,
        password: req.body.password
      })
      u.save();
      res.redirect('/login')
    } else {
      console.log(errors)
      res.render('register',{
        errors:errors
      })
    }
  })
  router.get('/logout',function(req,res){
    req.logout();
    res.redirect('/login');
  })

 return router;
};

export default func;
