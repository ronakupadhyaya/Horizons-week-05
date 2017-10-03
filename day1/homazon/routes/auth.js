import express from 'express';
const router = express.Router();
import User from '../models/user';
import Product from '../models/product';
module.exports = function(passport){
  var validateReq = (userData) => (userData.password === userData.confirmPassword && userData.password && userData.confirmPassword && userData.username);
  router.get('/', (req, res) => {
    if(!req.user){
      res.redirect('/login');
    } else{
      Product.find().then((products) => {
        res.render('dashboard', {user: req.user, products: products, count: req.session.cart.length});
      });

    }
  });

  router.get('/signup', (req, res) => {
    res.render('signup');
  });
  router.post('/signup', (req, res) => {

    if(!validateReq(req.body)){
      return res.render('signup', {
        error: "Passwords don't match."
      });
    } else{

      var newUser = new User({
        username: req.body.username,
        password: req.body.password
      });
      newUser.save().then((user) => {
        console.log("USER", user);
        res.redirect('/login');
      })
      .catch((err) => {
        console.log("ERR", err);
        res.send(err);
      })
    }
  });

  router.get('/login', (req, res) => {
    res.render('login');
  });
  var initializeCart = (req, res, next) =>{
      req.session.cart = [];
      next();
  };


  router.post('/login', initializeCart, passport.authenticate('user', {
    successRedirect: '/',
    failureRedirect: '/login'
  }));
  router.get('/logout', (req, res) => {
    req.logout();
    res.redirect('/login');
  })

  //admin login

  router.get('/admin/login', (req, res) => {
    res.render('admin-login');
  })
  router.post('/admin/login', passport.authenticate('admin', {
    successRedirect: '/admin/home',
    failureRedirect: '/login'
  }));
  
  return router;
}
