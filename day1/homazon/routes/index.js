var express = require('express');
var router = express.Router();
import Models from '../models/models'
var User = Models.User;

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});
module.exports = router;
