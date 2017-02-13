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
mongoose.Promise = Promise;
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
  },
  author: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Author'
  }
});

var Follow = mongoose.model('Follow', {
  follower: {
    type: mongoose.Schema.types.ObjectId,
    ref: 'User'
  },
  followee: {
    type: mongoose.Schema.types.ObjectId,
    ref: 'User'
  }
})

app.get('/newUser', function(req, res) {
  new User({firstName: 'User2', lastName: 'Lastname2'})
  .save(function (err, user) {
    if (err) {
      console.log(err);
    } else {
      res.json(user);
    }
  })
})

app.get('/makeUser1FollowUser2', function(req, res) {
  new Follow({follower: user1, followee: user2})
  .save(function(err, follow) {
    res.json(follow);
  })
})

app.get('/whoIsFollowingUser2', function(req, res) {
  Follow.find({
    followee: user2
  })
  .populate('follower')
  .exec(function(err, followers) {
    res.json(followers)
  })
})

app.get('/', function(req, res) {
  Comment.find()
  .populate('author')
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
    return Author.insertMany(authors.map(function(author) {
      return new Author(author);
    }));
  })
  .then(function(authors) {
    var i = 0;
    return Comment.insertMany(comments.map(function(comment) {
      comment.author = authors[i++]._id;
      return new Comment(comment);
    }));
  })
  .then(function(comments) {
    res.redirect('/');
  })
  .catch(function(err) {
    res.status(500).json(err);
  });
});

app.listen(3000);
