// module.exports = router;import express from 'express'
import express from 'express'
var router = express.Router();
import { User, Product } from '../models/models'

// var User = models.User;

module.exports = function(passport) {
  // Add Passport-related auth routes here, to the router!
  // YOUR CODE HERE
  router.get('/', function(req, res) {
    if (req.user) {
      res.redirect('/products')
    } else {
      res.redirect('/login')
    }
  })

  router.get('/signup', function(req, res) {
    res.render('signup');
  });

  var validateReq = function(userData) {
    return (userData.password === userData.passwordRepeat);
  };

  router.post('/signup', function(req, res) {

    if (req.body.username && req.body.password && validateReq(req.body)) {
      var newUser = new User({
        username: req.body.username,
        password: req.body.password
      })

      newUser.save(function(err, user) {
        if (err) {
          console.log(err);
          res.status(500).redirect('/register');
          return;
        }

        res.redirect('/login');
      });
    }

  })

router.get('/login', function(req, res) {

  res.render('login')
})

router.post('/login', passport.authenticate('local', { successRedirect: '/products',
failureRedirect: '/login' }));

router.get('/logout', function(req, res) {
  req.logout();
  res.redirect('/login');
});

// router.get('/products', function(req, res) {
//   // res.render('products')
//   console.log('enter auth.js');
//   Product.find(function(err, products) {
//     if (err) console.log(err);
//     res.render('products', {
//       products: products
//     })
//   })
// })

  return router;
}
