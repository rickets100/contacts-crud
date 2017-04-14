var express = require('express');
var router = express.Router();
var db = require('../db/connection');

//======== GET ALL CONTACTS ========
router.get('/', function(req, res, next) {
  // db('contacts').select('*').orderBy('last_name')
  // .then(snack => {
  //   res.render('contacts/index', { contact });
  // })
  // .catch(err => {
  //   next(err);
  // })
  res.render()
});


module.exports = router;
