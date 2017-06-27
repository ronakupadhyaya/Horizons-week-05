//var express = require('express');
import express from 'express';
var router = express.Router();
import expressValidator from 'express-validator';
//var expressValidator = require('express-validator')
import passport from 'passport';

var models = require('../models/models');

var User = require('../models/models').User;

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});

//get sign up page
router.get('/signup',function(req,res){
	res.render('signup');
})

//post to sign up page
router.post('/signup',function(req,res){
	req.checkBody('username', 'Invalid Username').notEmpty();
	req.checkBody('password', 'Invalid Password').notEmpty();
	req.checkBody('passwordRepeat', 'Passwords must match').equals(req.body.password);
	
	var errors = req.validationErrors();
		if (errors) {
		console.log(errors);
		res.render('signup', {errors: errors});
		 } else{
		 	var newUser = User({
			username: req.body.username,
			password: req.body.password
		})

		//not entirely sure this is right
		newUser.save()
		.then((err) => {
			if(err){
				console.log(err);
				console.log("Couldn't save Object")
				res.redirect('signup')
			}
		})

		// newUser.save(function(err){
		// 	if(err){
		// 		console.log(err);
		// 		console.log("Couldn't save Object")
		// 		res.redirect('signup')
		// 	}
		// })
		console.log(newUser)
		res.redirect('/login')

		 }
})


router.get('/login',function(req,res){
	req.session.shoppingCart = [];
	res.render('login')
})

// POST Login page
router.post('/login', passport.authenticate('local', {successRedirect: '/',
													  failureRedirect: '/login'}));

router.get('/logout', function(req,res){
	req.logout();
	res.redirect('/login')
})


module.exports = router;
//export default router
