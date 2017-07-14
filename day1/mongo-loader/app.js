var express = require('express');
var app = express();

['MONGODB_URI'].map(k => {
  if (! process.env[k]) {
    console.error('Missing environment variable', k, 'Did your source env.sh');
    process.exit(1);
  }
});

// import hbs from 'express-handlebars'

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
  console.log('this is what you are requiring!!!!', movies);
  var promiseArray = [];
  for (var i=0; i<movies.length; i++) {
    var newMovie = new Movie ({
      title: movies[i].title,
      url: movies[i].url,
      photo: movies[i].photo,
      year: movies[i].year,
      rating: movies[i].rating,
    });
    promiseArray.push(newMovie.save());
  }
  Promise.all(promiseArray)
    .then(function(returnedArray) {
      console.log(returnedArray);
      res.redirect('/');
    });
});



var port = process.env.PORT || 3000;
app.listen(port, function() {
  console.log('Express started, listening to port: ', port);
});
