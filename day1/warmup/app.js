"use strict";

var path = require('path');
var express = require('express');
var exphbs  = require('express-handlebars');

var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var app = express();

app.engine('hbs', exphbs({extname: 'hbs', defaultLayout: 'main'}));
app.set('view engine', 'hbs');

app.use(express.static(path.join(__dirname, 'public')));
app.use(bodyParser.urlencoded({extended: true}));
app.use(cookieParser());

app.get('/', function(req, res) {
  res.render('index', require('./menu.json'));
});

app.listen(3000);
