var express = require('express');
var products = require('../homazon/data/products.json');
var app = express();

['MONGODB_URI'].map(k => {
  if (! process.env[k]) {
    console.error('Missing environment variable', k, 'Did your source env.sh');
    process.exit(1);
  }
});

var hbs = require('express-handlebars')({
  defaultLayout: 'main',
  extname: '.hbs'
});
app.engine('hbs', hbs);
app.set('view engine', 'hbs');

var bodyParser = require('body-parser');
app.use(bodyParser.urlencoded({extended: false}));

var mongoose = require('mongoose');
mongoose.connect(process.env.MONGODB_URI);

var Product = require('../homazon/models/models.js').Product;

app.get('/', function(req, res) {
  res.render('index');
  // res.json(new Product);
  // Product.find().exec(function(err, products) {
  //   res.send('in product');
  //   if (err) {
  //     res.send(err);
  //   } else {
  //     res.render('index', {
  //       products: products
  //     });
  //   }
  // });
});

mongoose.Promise = Promise;

app.post('/load', function(req, res) {
  // Load all these movies into MongoDB using Mongoose promises
  // YOUR CODE HERE
  products = products.forEach(function(product) {
    new Product(product).save();
  });
  // res.send(products);
  // Promise.all(products)
  // .then(function() {
  //   res.send('done!');
  // });
  res.send('done!');
  // Do this redirect AFTER all the movies have been saved to MongoDB!

});

var port = process.env.PORT || 3000;
app.listen(port, function() {
  console.log('Express started, listening to port: ', port);
});
