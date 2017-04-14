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

// ===== CREATE A NEW CONTACT ======
// create a new contact, with the proviso:
// if req.params.addressId is not in addresses table,
// else (this means the address already exists)
// make the addressId field of the new contact = req.params.addressId
router.post('/', function(req, res, next) {
  var id = req.params.id
  var contact = {
    first_name: req.body.first_name,
    last_name: req.body.last_name,
    phone: req.body.phone,
    email: req.body.email,
    addressId: req.body.addressId
  }
  db('contacts')
  .insert(contact, '*')
  .where({ id })
  .then((newContact) => {
    console.log('in the router.post then section \n');
    // var newId = (newContact[0].id)
    // newPath=(`contacts/${newId}`)
    // res.redirect(newPath)

    // for now, just to got index page to show that something happened
    res.redirect('index', { title: 'My Contacts' })
  })
  .catch(err => {
    next(err);
  })
})

// ====== UPDATE ONE SNACK CONTACT ======
router.put('/:id', function(req, res, next) {
  var id = req.params.id
  var contact = {
    first_name: req.body.first_name,
    last_name: req.body.last_name,
    phone: req.body.phone,
    email: req.body.email,
    addressId: req.body.addressId
  }
  db('contacts')
  .update(contact, '*')
  .where({ id })
  .then(deletedContact => {
    console.log('got to the then of router.put')
    var id = deletedContact[0].id
    res.redirect(`/`)
  })
  .catch(err => {
    next(err);
  })
})
module.exports = router;
