"use strict";

var fs = require('fs');
var path = require('path');
var express = require('express');
var exphbs  = require('express-handlebars');
var parse = require('csv-parse');
var _ = require('underscore');

var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var app = express();
var mongoose = require('mongoose');
mongoose.connect(require('./connect'));

app.engine('hbs', exphbs({
  extname: 'hbs',
  defaultLayout: 'main',
  helpers: {
    prev: function(page) {
      // YOUR CODE HERE
      return `<a href="/?page=${page - 1}"> Previous page </a>`
    },
    next: function(page) {
      return `<a href="/?page=${page + 1}">Next page</a>`;
    },
  }
}));app.set('view engine', 'hbs');

app.use(express.static(path.join(__dirname, 'public')));
app.use(bodyParser.urlencoded({extended: true}));
app.use(cookieParser());

// Enable mongodb debug messages!
mongoose.set('debug', true);

var Book = mongoose.model('Book', {
  title: {
    type: String,
    required: true
  },
  author: {
    type: String
  }
});

app.get('/', function(req, res) {
  var page = parseInt(req.query.page) || 0;
  var pagelimit = 21; 
  Book.find()
    // YOUR CODE HERE sort books and paginate
    .sort('title')
    .skip(page * pagelimit)
    .limit(pagelimit)
    .exec(function(err, books) {
      var hasNext = false; 
      var hasPrev = false; 
      if(typeof books[20] === 'object'){
        hasNext = true; 
      }
      if(page > 0) hasPrev = true; 
      books = books.slice(0,20); 
      res.render('index', {
        page: page,
        hasNext: hasNext,  // YOUR CODE HERE only return true if there's a next page
        hasPrev: hasPrev,  
        books: books
      });
    });
});

app.get('/import/books', function(req, res) {
  var input = fs.createReadStream(path.join(__dirname, 'books.csv'));
  var parser = parse({columns: true});
  var books = [];
  var started = 0;
  var completed = 0;
  var inputDone = false;

  function finalize() {
    if (inputDone && completed === started) {
      res.redirect('/');
    }
  }

  function comp(err) {
    if (err) {
      console.error(err);
    }
    completed++;
    finalize();
  }

  input.pipe(parser);

  parser.on('readable', function() {
    var record;
    while (record = parser.read()) {
      started++;
      books.push(new Book({
        title: record.Title,
        author: record.Author
      }));
    }
  });

  parser.on('finish', function(){
    console.log('Done processing. Processed %s lines.', started);
    inputDone = true;
    finalize();
    books = _.shuffle(books);
    books.map(function(book) {
      book.save(comp);
    });
  });
});

app.listen(3000);
