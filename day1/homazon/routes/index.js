import express from 'express';
var router = express.Router();
import Product from '../models/product';
import Payment from '../models/payment';
import Order from '../models/order';
import User from '../models/user';
import stripePackage from 'stripe';
const stripe = stripePackage(process.env.STRIPE_SECRET_KEY);
/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});

router.get('/cart', (req, res, next) => {
  var cart = req.session.cart;
  var newCart = cart.reduce((total, item) => {
    if(total[item._id]){
      total[item._id]["count"]++;
      return total;
    } else{
      total[item._id] = item;
      total[item._id]["count"] = 1;
      return total;
    }
  }, {});
  var newCartArr = [];
  for(var key in newCart){
    newCartArr.push(newCart[key]);
  }
  var total = req.session.cart.reduce((total, item) => (total+= item.price), 0);
  console.log("TOTAL", process.env.STRIPE_PUBLISHABLE_KEY);
  res.render('cart', {user: req.user, products: newCartArr, count: req.session.cart.length, processKey: process.env.STRIPE_PUBLISHABLE_KEY, amount: total*100})

});

router.post('/cart/add/:pid', (req, res, next) => {
  var productId = req.params.pid;
  var cart = req.session.cart;
  Product.findById(productId).exec().then((product) => {
    req.session.cart.push(product);
    console.log("REQ SESSION", req.session);
    res.json("Item added!");
  });
});
router.post('/cart/remove/:pid', (req, res, next) =>{
  var productId = req.params.pid;
  var cart = req.session.cart;
  req.session.cart.splice(req.session.cart.indexOf(productId), 1);
  res.json("Item Removed!");
});

router.post('/cart/delete', (req, res) => {
  req.session.cart = [];
  res.json("Cart emptied");
});

router.post('/cart/checkout', (req, res) => {
  var token = req.body.stripeToken;
  var total = req.session.cart.reduce((total, item) => (total+= item.price), 0);
  console.log("total", total);
  stripe.customers.create({
    email: req.body.stripeEmail,
    source: token
  }).then((customer) => {
    return stripe.charges.create({
      amount: total * 100,
      currency: "usd",
      customer: customer.id
    });
  }).then((charge) => {

    var {source} = charge;
    var cart = req.session.cart;
    var newCart = cart.reduce((total, item) => {
      if(total[item._id]){
        total[item._id]["count"]++;
        return total;
      } else{
        total[item._id] = item;
        total[item._id]["count"] = 1;
        return total;
      }
    }, {});
    var newCartArr = [];
    for(var key in newCart){
      newCartArr.push(newCart[key]);
    }

    var newPayment = new Payment({
    stripeBrand: source.brand,
     stripeCustomerId: source.customer,
     stripeExpMonth: source.exp_month,
     stripeExpYear: source.exp_year,
     stripeLast4: source.last4,
     stripeSource: charge.source_transfer,
     status: charge.status,
     // Any other data you passed into the form
     _userid: req.user.id
   });
   newPayment.save().then((payment) => {
     var newOrder = new Order({
       createdAt: new Date(),
       contents: newCartArr,
       user: req.user._id,
       paymentInfo: payment._id,
       shippingInfo: charge.shipping,
       order: charge.order,
       total: total
     });
     newOrder.save().then((order) => {
       req.session.cart = [];
       res.render('thank-you');
     }).catch((err) => {
       console.log("ERR", err);
       res.send(err);
     })
   })
  })
});
router.get('/product/:pid', (req, res, next) => {
  Product.findById(req.params.pid).exec().then((product) => {
    res.render('product', {product: product, user: req.user});
  })
});

router.get('/admin/products', (req, res) => {
  Product.find().exec().then((products) => {
    res.render('admin-products', {products: products, user: req.user, count: products.length});
  })
})
router.get('/admin/edit/product/:pid', (req, res) => {
  var productId = req.params.pid;
  Product.findById(productId).exec().then((product) => {
    res.render('product-edit', {product});
  })
})
router.post('/admin/edit/product/:pid', (req, res) => {
  console.log("REQ BODY", req.body);
  var productId = req.params.pid;
  Product.findByIdAndUpdate(productId, req.body).exec().then((product) => {
    res.redirect('/admin/products');
  })
});

router.get('/admin/delete/product/:pid', (req, res) => {
  Product.findById(req.params.pid).remove().then((product) => {
    res.redirect('/admin/products');
  })
});

router.get('/admin/product/new', (req, res) => {
  res.render('product-new');
})

router.post('/admin/product/new', (req, res) => {
  var newProduct = new Product(req.body);
  newProduct.save().then((product) => {
    res.redirect('/admin/products');
  });
});

router.get('/admin/edit/order/:pid', (req, res) => {
  var order = req.params.pid;
  Order.findById(order).exec().then((order)=>{
    res.render('order-edit', {order: order, user: req.user});
  });
});

router.post('/admin/edit/order/:pid', (req, res)=>{
  var order = req.params.pid;
  Order.findByIdAndUpdate(order, req.body).then((order)=>{
    res.redirect('/');
  })
});

router.get('/admin/users', (req, res)=>{
  User.find().exec().then((users)=>{
    res.render('admin-users', {users: users, user: req.user});
  })
})
export default router;
