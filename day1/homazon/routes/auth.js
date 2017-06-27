export default function(passport, express, User, Product) {
  var router = express.Router();


  router.get('/', (req, res) => {
    var params = {user: req.user};
    Product.find().exec().then((response) => {
      params.products = response;

    })
    .then(function() {
      return Promise.all(req.session.cart.map((curr) => {
        return Product.findById(curr);
      }))
    })
    .then(function(result) {
      params.cart = result;
      res.render('index', params);
    })
    
  })

  router.get('/logout', (req, res) => {req.logout(); res.redirect('/')});
  //Routes to get login page
  router.post('/login', passport.authenticate("local", {
      successRedirect: '/login',
      failureRedirect: '/'
    }))
  router.get('/login', function(req, res) {
    req.session.cart = [];
    res.redirect('/');
  })

  router.post('/register', (req, res) => {
    var user = new User({username: req.body.username, password: req.body.password});
    user.save().then(()=> {res.redirect('/')});
    
  })


  return router;


};