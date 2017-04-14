var express = require('express');
var router = express.Router();
var db = require('../db/connection');

//======== GET ALL CONTACTS ========
router.get('/', function(req, res, next) {
  console.log("in the router.get function \n");
  db('contacts')
    .select('*')
    .innerJoin('addresses', 'contacts.address_id', 'addresses.id')
    .orderBy('last_name')
  .then(contact => {
    console.log(contact);
    // res.render('shared/_form')
    res.render('contacts', { contact });
  })
  .catch(err => {
    next(err);
  })
});

// ========= GET FORMS PAGE ========
router.get('/new', (req, res, next) => {
  res.render('new')
})

// ===== CREATE A NEW CONTACT ======
// create a new contact, with the proviso:
// if req.params.addressId is not in addresses table,
// else (this means the address already exists)
// make the addressId field of the new contact = req.params.addressId
router.post('/', function(req, res, next) {
  console.log("in the router.post function \n");
  var id = req.params.id
  var address = {
    line_1: req.body.line_1,
    last_name: req.body.last_name,
    phone: req.body.phone,
    email: req.body.email,
    address_id: req.body.address_id
  }

  var contact = {
    first_name: req.body.first_name,
    last_name: req.body.last_name,
    phone: req.body.phone,
    email: req.body.email,
  }
//   db('contacts')
//   .insert(contact, '*')
//   .where({ id })
//   .then((newContact) => {
//     console.log('in the router.post then section \n');
//     res.redirect('index', { title: 'My Contacts' })
//   })
//   .catch(err => {
//     next(err);
//   })
  res.redirect('views/shared/_form')
})

// ====== UPDATE ONE SNACK CONTACT ======
router.put('/:id', function(req, res, next) {
  console.log("in the router.put function \n");
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
