import express from 'express';
const router = express.Router();


import User from '../models/user';

function makeRouterWithPassport(passport) {
  router.get('/login', (req, res) => {
    res.render('login');
  });

  router.post('/login', passport.authenticate('local', {
    successRedirect: '/',
    failureRedirect: '/auth/login'
  }));

  router.get('/register', (req, res) => {
    res.render('register');
  });

  router.post('/register', (req, res) => {
    // TODO check password matches repeat
    var newUser = new User(req.body);
    newUser.save()
      .then(() => {
        res.redirect('/auth/login');
      })
      .catch((err) => {
        console.log(err);
        res.send("error!");
      })
  });

  return router
}

export default makeRouterWithPassport;
