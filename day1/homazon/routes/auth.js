import express from 'express';
var router = express.Router();
import models from '.././models/models';
var User = models.User;
var Product = models.Product;
import expressValidator from 'express-validator';

export default function(passport) {
/* GET users listing. */
router.use(expressValidator());


router.get('/signup', function(req,res) {
  res.render('signup');
});

var validateUser = function(userData) {
  return (userData.password ===userData.passwordRepeat);
};

router.post('/signup', function(req,res) {
  var errors = req.validationErrors();

  req.check('username', 'Username field is required').notEmpty();
  req.check('password', 'Password field is required').notEmpty();

  if (errors) {
    res.render('signup', {
      errors: errors
    })
  }

  if (! validateUser(req.body)) {
    return res.render('signup', {
      error: "Passwords don't match."
    });
  }

  var Person = new User ({
    username: req.body.username,
    password: req.body.password
  });

  Person.save()
  .then(function(response) {
    console.log("response", response);
    res.redirect('/login');})
  .catch(function(error) {
      console.log("error", error);
      return res.status(500).redirect('/signup');
    })
});

router.get('/login', function(req,res) {
  res.render('login');
});

router.post('/login', passport.authenticate('local', {
  successRedirect: '/',
  failureRedirect: '/login'
}));

router.get('/logout', function(req,res) {
  req.logout();
  res.redirect('/login');
});


return router;
};
