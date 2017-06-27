import express from 'express';
var router = express.Router();


/* GET users listing. */
import models from '../models/models';
var User = models.User;
var Product = models.Product;
import passport from 'passport';
/* GET home page. */

// GET /
router.get('/', function (req, res) {
  if (req.user) {
    res.redirect('/home')
  }
  else {
    res.redirect('/login')
  }
});

// GET signup page
router.get('/registration', function (req, res) {
  res.render('registration');
});

// POST signup page
var validateReq = function (userData) {
  return (userData.password === userData.passwordRepeat);
};

router.post('/registration', function (req, res) {
  if (!validateReq(req.body)) {
    return res.render('registration', {
      error: "Passwords don't match."
    });
  }
  var u = new User({
    username: req.body.username,
    password: req.body.password,
  });

  u.save(function (err, user) {
    if (err) {
      console.log(err);
      res.status(500).redirect('/register');
      return;
    }
    console.log(user);
    res.redirect('/login');
  });
});

// GET Login page
router.get('/login', function (req, res) {
  res.render('login');
});

// POST Login page
router.post('/login', passport.authenticate('local', {
  successRedirect: '/home',
  failureRedirect: '/login'
}));

// GET Logout page
router.get('/logout', function (req, res) {
  req.logout();
  res.redirect('/login');
});

export default router;



