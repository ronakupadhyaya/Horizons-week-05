import express from 'express';
var router = express.Router();

// session dependencies
import session from 'express-session';
import {Strategy} from 'passport-local';

// database imports
import MongoStore_func from 'connect-mongo';
var MongoStore = MongoStore_func(session);

import mongoose from 'mongoose';

// model imports
import {User} from '../models/models';

mongoose.Promise = global.Promise;



export default function(passport){
  // passport authentication
  // router.use(session({
  //   secret: process.env.SECRET,
  //   store: new MongoStore({mongooseConnection: mongoose.connection})
  // }));

  passport.serializeUser(function(user, done){
    done(null, user._id);
  });

  passport.deserializeUser(function(id, done){
    User.findById(id).exec()
    .then( (foundUser) => {
        done(null, foundUser);
    });

  });

  // local strategy here
  passport.use(new Strategy(function(username, password, done){
    User.findOne({username: username}).exec()
    .then( (user) => {
      if(!user){
        return done(null, false);
      }
      if(user.password !== password){
        return done(null, false);
      }
      return done(null, user);
    })
    .catch( (err) => {
      return done(err);
    });

  }));


  router.use(passport.initialize());
  router.use(passport.session());

  return router;

};
