import express from 'express';
import mongoose from 'mongoose';
import models from '../models/models';

var router = express.Router();


/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});

router.get('/products', (req, res) => {
  res.send('products page!')
})
export default router;
