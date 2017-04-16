var express = require('express')
var router = express.Router()

//======== GET INDEX PAGE ========
router.get('/', function(req, res, next) {
  res.redirect('/contacts')
})

module.exports = router
