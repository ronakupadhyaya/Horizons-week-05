var express = require('express');
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

// var uer = new User({
//   username: "asd"
// })
//
//
//
//     var data=movies[0];
//     var newMovie=new Movie({
//       title: data.title,
//       url: data.url,
//       photo: data.photo,
//       year: data.year,
//       rating: data.rating
//     })
//     newMovie.save()
//

    movies=movies.map(function(data){
      var newMovie=new Movie({
        title: data.title,
        url: data.url,
        photo: data.photo,
        year: data.year,
        rating: data.rating
      })
      return newMovie.save()

    })

    //promise.all converts array of promises into 1 promise

    Promise.all(movies)

      .then(function(resps){
        console.log(resps)
        res.redirect('/');
      })

  // Array.prototype.map((movies), function(movie){
  //   movie.save();
  // })
  // Do this redirect AFTER all the movies have been saved to MongoDB!

});

var port = process.env.PORT || 3000;
app.listen(port, function() {
  console.log('Express started, listening to port: ', port);
});
