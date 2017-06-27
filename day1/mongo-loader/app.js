import express from 'express';
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

import bodyParser from 'body-parser';
app.use(bodyParser.urlencoded({extended: false}));

import mongoose from 'mongoose';
mongoose.connect(process.env.MONGODB_URI);
var Movie = mongoose.model('Movie', {
  title: {
    type: String,
    required: true
  },
  url: String,
  photo: {
    type: String,
    required: true
  },
  year: String,
  rating: String
});

app.get('/', function(req, res) {
  Movie.find(function(err, movies) {
    res.render('index', {
      movies: movies
    });
  });
});

mongoose.Promise = Promise;

app.post('/load', function(req, res) {
  // Load all these movies into MongoDB using Mongoose promises
  // YOUR CODE HERE
  var movies = require('./movies.json');
  Promise.all(movies.map(function(movie) {
    var curr = new Movie(movie);
    curr.save(function(err, added) {
      if (err) {
        console.log(err);
      } else {
        console.log(added);
      }
    });
  }))
  .then(function() {
    res.redirect('/');
  });
  // Do this redirect AFTER all the movies have been saved to MongoDB!

});

var port = process.env.PORT || 3000;
app.listen(port, function() {
  console.log('Express started, listening to port: ', port);
});
