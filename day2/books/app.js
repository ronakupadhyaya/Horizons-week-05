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

//if paginating by 10, call 11 items and if 11 items is missing
//know that nothing is left and then can get rid of the button
//get 11, only show 10 (hide 11th item)

app.get('/', function(req, res) {
  //use query page parameter to keep track of page, can ultilize
  //through simple algorithm to keep order straight
  var page=parseInt(req.query.page || 1)
  // Task 1: Sort these books by title
  // Task 2: Limit to 20 results
  // Task 3: Implement a query parameter req.query.page that lets users page
  //         through books with .skip()
  Book.find() //returns array o all things, whereas findOne only returns one thing
  .limit(21) //direcive to mongoose to only return 10 things
  .skip(20*(page-1))//skip the first 10 and get the next 10
  .sort({title:1}) //sort bualphabetical order (-1= reverse alphabetical order)
  //when storing by multiple items can sort by multiple items but will take the 
  //keys in subsequenct order
  ///can use variables to add in pagination
  .exec(function(err, books) {
    var displaybooks=books.slice(0,20);
    if(page!==1 && books.length===21){
    res.render('index', {
      books: displaybooks,
      //eventually want to remove previous page button at 1 and
      //next page button on last page
      prev: page-1,
      next: page+1
    });
  }
  if(page===1){
    res.render('index', {
      books: displaybooks,
      //eventually want to remove previous page button at 1 and
      //next page button on last page
      next: page+1
    });
  }
  if(books.length!==21){
    res.render('index', {
      books: displaybooks,
      //eventually want to remove previous page button at 1 and
      //next page button on last page
      prev: page-1
    });
  }
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
