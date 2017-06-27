import express from 'express';
import models from '../models/models';
var User = models.User;
var Product = models.Product;
var Payment = models.Payment;

var router = express.Router();
import expressValidator from 'express-validator';
import passport from 'passport';
import products from '../seed/products.json';
import stripePackage from 'stripe';
const stripe = stripePackage(process.env.SECRET_KEY);

/* GET home page. */
router.use(expressValidator());

router.get('/', function(req, res) {
  res.redirect('/login');
});

router.get('/login',function(req,res) {
  res.render('login');
});

router.post('/login',passport.authenticate('local',
  { successRedirect:'/products',
    failureRedirect:'/login'}));

router.get('/logout',function(req,res) {
  req.logout();
  res.redirect('/')
})

router.get('/signup',function(req,res) {
  res.render('signup');
})

router.post('/signup',function(req,res) {
  req.check('username',"username cannot be empty").notEmpty();
  req.check('password','Password cannot be empty').notEmpty();
  req.check('passwordRepeat','PasswordRepeat cannot be empty').notEmpty();
  req.check('passwordRepeat','Passwords do not match').equals(req.body.password);
  var err = req.validationErrors();
  if (err) {
    res.render('signup',{
      error:err
    })
  } else {
    var newUser = new User({
      username: req.body.username,
      password: req.body.password
    });
    newUser.save().then((doc)=> {
      res.redirect('/')
    });
  }
})

router.get('/products', (req, res, next) => {
  Product.find().exec().then((products)=> {
    console.log(products)
    console.log("user",req.user);
    res.render('products',{
      products: products,
      user:req.user
    })
  })
});

router.get('/cart', (req, res, next) => {
  // Render a new page with our cart
  var totalPrice = calcTotalAmount(req)
  res.render('cart',{
    products:req.session.cart,
    user:req.user,
    totalPrice: totalPrice
  });
});

router.post('/cart/add/:pid', (req, res, next) => {
  // Insert code that takes a product id (pid), finds that product
  // and inserts it into the cart array. Remember, we want to insert
  // the entire object into the array...not just the pid.
  if (!req.session.cart) {
    req.session.cart=[];
  }
  Product.findById(req.params.pid).exec()
    .then((found)=> {
      var matches = req.session.cart.filter((item)=> {
        return item.title.toString() === found.title.toString()
      })
      if (matches.length === 0) {
        var newProd = {
          title:found.title,
          price:found.price,
          number:1,
          imageUri:found.imageUri,
          _id:found._id
        };
        req.session.cart.push(newProd);
      } else {
        var currentItem = matches[0];
        var idx = req.session.cart.indexOf(currentItem);
        req.session.cart[idx].number = currentItem.number+1;
      }
      res.redirect('/cart');
    });
});

router.post('/cart/delete/:pid', (req, res, next) => {
  // Insert code that takes a product id (pid), finds that product
  // and removes it from the cart array. Remember that you need to use
  // the .equals method to compare Mongoose ObjectIDs.
    var matches = req.session.cart.filter((item)=> {
      return item._id.toString() === req.params.pid.toString()
    })
    var idx = req.session.cart.indexOf(matches[0])
    if (matches[0].number === 1) {
      req.session.cart.splice(idx,1);
    } else {
      req.session.cart[idx].number = req.session.cart[idx].number-1;
    }
    res.redirect('/cart');
});

router.get('/cart/delete', (req, res, next) => {
  // Empty the cart array
  req.session.cart=[];
  res.redirect('/cart')
});

router.get('/product/:pid', (req, res, next) => {
  // Insert code to look up all a single product by its id
  var pId = req.params.pid;
  // and show it on the page
  Product.findById(pId).exec().then((product)=> {
    res.render('singleProduct',{
      product:product
    })
  })
});

router.get('/checkout', (req,res,next)=> {
  var totalPr = calcTotalAmount(req).toString();
  var totalPrice = totalPr.replace('.','');
  res.render('payment',{
    API_key:process.env.PUBLISHABLE_KEY,
    totalPrice:totalPrice
  })
});

router.post('/checkout',(req,res,next)=> {
  var totalPr=calcTotalAmount(req).toString();
  var indexofpoint = totalPr.indexOf('.');
  if (indexofpoint !== -1) {
    var totalPr = totalPr.substring(0,indexofpoint+2);
    var totalPrice = parseInt(totalPr.replace('.',''));
  } else {
    console.log(totalPrice)
    var totalPrice = parseInt(totalPr)*100;
  }
  // Create a Customer:
  stripe.customers.create({
    email: req.body.stripeEmail,
    source: req.body.stripeToken
  }).then(function(customer) {
    // YOUR CODE: Save the customer ID and other info in a database for later.
    return stripe.charges.create({
      amount: totalPrice,
      currency: "usd",
      customer: customer.id,
    });
  }).then(function(charge) {
    // Use and save the charge info.
    var status =0;
    console.log(charge)
    var newPayment = new Payment({
      stripeBrand: charge.source.brand,
      stripeCustomerId: charge.customer,
      stripeExpMonth: charge.source.exp_month,
      stripeExpYear: charge.source.exp_year,
      stripeLast4: charge.source.last4,
      stripeSource: charge.source.id,
      status: charge.source.status,
      _userid: req.user._id
    })
    newPayment.save()
      .then(saved=> {
        console.log("saved")
      })
  });
})
function calcTotalAmount(req) {
  var totalPrice = 0;
  req.session.cart.forEach( (prod)=>{
    totalPrice += parseFloat(prod.price) * prod.number;
  })
  return totalPrice;
}
export default router;
