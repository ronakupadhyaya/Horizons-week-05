"use strict";

var path = require('path');
var express = require('express');
var exphbs  = require('express-handlebars');

var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var mongoose = require('mongoose');
mongoose.connect(require('./connect'));

var app = express();

app.engine('hbs', exphbs({extname: 'hbs', defaultLayout: 'main'}));
app.set('view engine', 'hbs');

app.use(express.static(path.join(__dirname, 'public')));
app.use(bodyParser.urlencoded({extended: true}));
app.use(cookieParser());

var Restaurant = mongoose.model('Restaurant', {
  // YOUR MODEL HERE
  restaurant: String,
  menu: [
    {
    name: String,
    price: Number,
    ingredients: [] //nothing inside means anything can go inside
    }
  ]
});

var Message = mongoose.model('Message', {
  body: {
    type: String,
    required: true
  },
  user: {
    type: mongoose.Schema.Types.ObjectId, // specifying the type here, can only put objectId inside User
    ref: 'User',
    required: true
  },
  contact: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Contact',
    required: true
  }
});

app.get('/:id', function(req, res){
  Message.findById(req.params.id)
  .populate('user contact')
  .exec(function(error, msg) {
      res.render('msg' {
          msg: msg
      })
  })
})

var Student = mongoose.model('Student', {
    name: String,
    classes: [
        {
          type: mongoose.Schema.Types.ObjectId,
          ref: 'Class'
        }
    ]
});
var Class = mongoose.model('Class', {
    name: String,
    students: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Student'
      }
    ]
})
app.get('/students', function(req,res){
    res.render('students', {
    })
})

app.get('/', function(req, res) {
  Restaurant.find(function(err, restaurants) {
    res.render('index', {
      restaurants: restaurants
    });
  });
});

app.get('/create', function(req, res) {
  var r = new Restaurant(require('./menu.json'));
  r.save(function(err) {
    res.redirect('/');
  });
});

app.listen(3000);
