import express from 'express';
import expressHandlebars from 'express-handlebars';
var router = express.Router();
import {User,Product} from '../models/models';

// import products from '../seed/products.json';
// var productPromises = products.map((product) => (new Product(product).save()));
// Promise.all(productPromises)
//   .then(() => (console.log('Success. Created products!')))
//   .catch((err) => (console.log('Error', err)))

router.use(function(req, res, next){
  if (!req.user) {
    console.log('redirect to login!');
    res.redirect('/login');
  } else {
    return next();
  }
});
router.get('/', (req, res, next) => {
  Product.find().exec().then(function(resp){
    res.render('index',{title:req.user.username, products:resp});
  })
  // Insert code to look up all products
  // and show all products on a single page
});

router.post('/cart/add/:id',(req,res)=> {
  Product.findById(req.params.id).exec().then(function({_id,title,imageUri,price}){
    if (req.session.cart.find(function(obj){
      return obj.id === req.params.id
    })) {
      var num =req.session.cart.findIndex(function(ele){
        ele.id === req.params.id
      });
      req.session.cart[num].quantity++;
    } else {
      var obj = {
        id:_id, title:title,imageUri:imageUri,price:price,quantity:1
      };
      req.session.cart.push(obj);
      console.log(req.session.cart);
      res.redirect('/cart');
    }
  })
})


router.get('/cart',(req,res)=>{
  res.render('cart',{products:req.session.cart})
})

router.get('/product/:pid', (req, res) => {
  Product.findById(req.params.pid)
  .exec().then((result)=> {
    var array=[result];
    res.render(index,{title:req.user.username, products:array})
  })

});

export default router;
