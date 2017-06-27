import express from 'express';
var router = express.Router();
import models from '../models/models'; 
import products from '../seed/products.json';
import session from 'express-session';

var User = models.User; 
var Product = models.Product;

/* GET home page. */
// router.use(function(req, res, next) {

// })

// GET /
router.get('/', function(req, res, next) {
  if (req.user) {
		res.redirect('/main')
	} else {
		res.redirect('/login')
	}
});

// GET /main
router.get('/main', function(req, res, next) { 
	console.log('req.session:', req.session)
	Product.find().exec()
	.then((response) => {res.render('main', {products:response})})
}); 

// GET /product/:pid 
router.get('/product/:pid', function(req, res, next) {
	Product.findById(req.params.pid).exec()
	.then((item) => {
		console.log(item)
		res.render('product', {product:item})
	})
})

// POST /cart/add/:pid 
router.post('/cart/add/:pid', function(req, res, next) {
	Product.findOne({id: req.params.id}).exec()
	.then((product) => {
		req.session.cart.push(product); 
		res.redirect('/main')
	})
})



export default router; 


// Misc. code //

// Product.remove({}).
// 	.then((err) => console.log('Error:', err))
	
// 	Promise.all([products.map(function(product) {
// 	var newProduct = new Product ({
// 			title: product.title, 
// 			imageUri: product.imageUri, 
// 			description: product.description
// 		})
// 		newProduct.save()
// 	})])
// 	.then(() => { 
// 		console.log('Success! The database is seeded with the products.'); 
// 		next(); 
// 	})
// 	.catch((err) => console.log('Error', err)) 
