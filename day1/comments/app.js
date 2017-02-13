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

var Author = mongoose.model('Author', {
  firstName: {
    type: String,
    required: true
  },
  lastName: {
    type: String,
    required: true
  }
});

var Comment = mongoose.model('Comment', {
  body: {
    type: String,
    required: true
  }
  // YOUR CODE HERE
});

app.get('/', function(req, res) {
  Comment.find()
  .exec(function (err, comments) {
    if (err) {
      res.status(500).json(err);
    } else {
      res.render('index', {
        comments: comments
      });
    }
  });
});

app.get('/import/comments', function(req, res) {
  var authors = require('./authors.json');
  var comments = require('./comments.json');
  Promise.all([Author.remove({}), Comment.remove({})])
  .then(function() {
    Author.insertMany(authors.map(function(author) {
      return new Author(author);
    }), function(err, authors) {
      if (err) {
        res.status(500).json(err);
      } else {
        var i = 0;
        Comment.insertMany(comments.map(function(comment) {
          comment.author = authors[i++]._id;
          return new Comment(comment);
        }), function(err, comments) {
          if (err) {
            res.status(500).json(err);
          } else {
            res.redirect('/');
          }
        });
      }
    });
  })
  .catch(function(err) {
    res.status(500).json(err);
  });
});

app.listen(3000);
