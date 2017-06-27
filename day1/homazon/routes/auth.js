import express from 'express';
import expressValidator from 'express-validator';
import models from '../models/models'; 
var router = express.Router();

export default function(passport) {
	
router.get('/', function(req, res) {
	if (req.user) {
		res.redirect('/main')
	} else {
		res.redirect('/login')
	}
})

// GET /signup
router.get('/signup', function(req, res) {
	res.render('signup')
})

// POST /signup 
var validateReq = function(userData) {
return (userData.password === userData.confirmPassword);
};

router.post('/signup', function(req, res) {
	console.log(req.body)
	if (!validateReq(req.body)) {
  		return res.render('signup', {error: "Passwords don't match."});
	}

	req.checkBody('username', 'Put in a username.').notEmpty(); 
	req.checkBody('password', 'Put in a password.').notEmpty();  

	var errors = req.validationErrors(); 
	console.log(errors)
	if(errors) {
		return res.render('signup', {
			errors: errors
		});
	} else {
		console.log('flag', req.body)
	  	var newUser = new models.User({
	  		username: req.body.username,
	  		password: req.body.password, 
		});	
		newUser.save(function(err, user) {
	    	if (err) {
	    		console.log("error", err)
	    		res.status(500).redirect('/signup');
	 		} else {
	  			res.redirect('/login');
	  		}
	  	// What would this look like with promises? 
	  	// newUser.save().then((user) => {
	  	// 	 res.redirect('/login')
	  	// })	
  		// .catch(function(err) {
  		// 	console.log('error', err); 
  		// 	res.status(500).redirect('/signup')
  		// })
	  	})		
	};
});

// GET /login
router.get('/login', function(req, res) {
	res.render('login'); 
})

// POST /login
router.post('/login', passport.authenticate('local', {failureRedirect: '/login'}), 
	function(req, res) {
		req.session.cart = []; 
		res.redirect('/main')
	}
); 

// GET /logout
router.get('/logout', function(req, res) {
	req.logout(); 
	res.redirect('/login'); 
}) 	


return router; 
}	