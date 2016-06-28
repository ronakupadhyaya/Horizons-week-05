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

app.engine('hbs', exphbs({extname: 'hbs', defaultLayout: 'main'}));
app.set('view engine', 'hbs');

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
  },
  publishDate: {
    type: Date,
    required: true
  },
  grossSales: {
    type: Number,
    required: true
  },
  unitSales: {
    type: Number,
    required: true
  }
});

app.get('/', function(req, res) {
  // Task 1: Sort these books by title
  // Task 2: Limit to 20 results
  // Task 3: Implement a query parameter req.query.page that lets users page
  //         through books with .skip()
  var page = parseInt(req.query.page || 1);
  Book.find()
  .limit(50)
  .skip(10*(page-1))
  .sort({title: -1})
  .exec(function(err, books) {
    var displayBooks = books.slice(0,20);
    res.render('index', {
      books: displayBooks,
      page: page,
      // prev: page - 1,
      // next: page + 1
      hasNext: books.length === 21;
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
        author: record.Author,
        publishDate: Date.parse(record['Publ Date']),
        grossSales: parseFloat(record.Value.replace(/[,£]/g,'')),
        unitSales: parseInt(record.Volume)
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
