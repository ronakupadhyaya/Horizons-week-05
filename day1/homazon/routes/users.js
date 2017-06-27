import express from 'express';
var router = express.Router();
import {User,Product} from '../models/models';
/* GET users listing. */
router.get('/', function(req, res, next) {
  res.send('respond with a resource');
});


export default router;
