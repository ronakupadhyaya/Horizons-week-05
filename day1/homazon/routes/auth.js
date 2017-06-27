import express from 'express';
var router = express.Router();

import User from '../models/models'

export default function (passport) {

    router.get('/login', (req, res) => {
        if (req.user) {
            res.redirect('/')
        } else {
            res.render('login');
        }
    });

    router.get('/register', (req, res) => {
        res.render('register');
    });

    router.post('/register', (req, res) => {
        var newUser = new User({
            username: req.body.username,
            password: req.body.password
        });

        newUser.save().then((response) => {
            res.redirect('/login');
        });
    });

    router.post('/login', passport.authenticate('local', {
        successRedirect: '/',
        failureRedirect: '/login'
    }));

    router.get('/logout', (req, res) => {
        req.logout();
        res.redirect('/');
    });

    return router;
}