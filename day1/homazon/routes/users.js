import express from 'express';
var router = express.Router();
var User = require('../models/models').User;

/* GET users listing. */
export default function(passport) {
  router.get('/signup', function(req, res) {
    res.render('signup');
  });

  router.post('/signup', function(req, res) {
      var newUser = new User({
        username: req.body.username,
        password: req.body.password
      });

      newUser.save(function(err, user) {
        if (err) {
          console.log(err);
          res.status(500).redirect('/signup');
          return;
        }
        res.redirect('/login');
      });
    });

    router.get('/login', function(req, res) {
      res.render('login');
    });

    router.post('/login', passport.authenticate('local', {
      successRedirect: '/',
      failureRedirect: '/login'
    }));

    router.get('/logout', function(req, res) {
      req.logout();
      res.redirect('/login');
    });
    return router;
}

//module.exports = router;
//export default router;
