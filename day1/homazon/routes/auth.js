import express from 'express';
import mongoose from 'mongoose';
import models from '../models/models';

var User = models.User;

// Create the router
var router = express.Router();

module.exports = function(passport) {

	// GET /login :: Render the login page
	router.get('/login', function(req ,res) {
		res.render('login');
	});

	// GET /signup :: Render the sign up page
	router.get('/signup', function(req, res) {
		res.render('signup');
	});	

	// POST /signup :: Validate form and display errors, create new user and save to database
	router.post('/signup', function(req, res) {
		req.checkBody('username', 'Fill in username').notEmpty();
		req.checkBody('password', 'Fill in password').notEmpty();
		req.checkBody('passwordRepeat', 'Fill in password repeat').notEmpty();
		req.checkBody('passwordRepeat', 'Passwords must match').matches(req.body.password);
		
		var errors = req.validationErrors();
		if(errors) {
		  console.log(errors);
		  res.render('signup',{
		    errors: errors
		  });
		}
		else {
			var newUser = new User({
				username: req.body.username,
				password: req.body.password,
				phone: req.body.phone
			});

			newUser.save(function(err){
				if (err) {
					console.log(err);
				}
				else {
					res.redirect('/login');
				}
			})
		}
	});

	// POST /login :: If login is successful, go to contacts, else redirect to login
	router.post('/login', passport.authenticate('local', {
	  successRedirect: '/',
	  failureRedirect: '/login',
	}));

	// GET /logout :: Logout user and end the session
	router.get('/logout', function(req, res) {
		req.logout();
		res.redirect('/login');
	});

	// Middleware to redirect to login
	router.use('/', function(req, res, next) {
		if (req.user) {
			next();
		}
		else {
			res.redirect('/login');
		}
	});

	return router;
}