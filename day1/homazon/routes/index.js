export default function(express, User, Product) {
  var router = express.Router();

  router.get('/products/:id', (req, res) => {
    Product.findById(req.params.id).exec().then((response) => {
      res.render('product', {user: req.user, product: response});
    })
  })

  router.get('/cart', (req, res) => {
    var cart = req.session.cart;
    var products = [];
    Promise.all(cart.map((curr) => {
      return Product.findById(curr);
    }))
      .then((results) => {
        console.log(results);
        res.render('cart', {user: req.user, cart: results});
      });
  })

  router.post('/cart/add/:id', (req, res) => {
    req.session.cart.push(req.params.id);
    res.redirect('/');
  })

  router.delete('/cart/delete/:id', (req, res) => {
    console.log("inside delete cart item request");
    var cart = req.session.cart;
    var index = cart.indexOf(req.params.id);
    console.log("pre", req.session.cart);
    req.session.cart.splice(index, 1);
    console.log("post", req.session.cart);
    res.status(200).send();
  })

  router.delete('/cart/delete', (req, res) => {
    console.log("inside here?");
    
  })


  return router;


};