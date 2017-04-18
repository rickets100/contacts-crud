// *********************************
// Amber and I worked on the delete and put together. It eventually got too confusing working in parallel on two sets of code, so we switched to focusing on getting mine functional.
// *********************************

var express = require('express')
var router = express.Router()
var db = require('../db/connection')
var bodyParser = require('body-parser')

//======== GET ALL CONTACTS ========
router.get('/', function(req, res, next) {
  console.log('IN ROUTER.GET / ');
  db('contacts')
  .select('contacts.id', 'first_name', 'last_name', 'phone_number', 'email_address', 'address_id', 'line_1', 'line_2', 'city', 'zip')
  .innerJoin('addresses', 'contacts.address_id', 'addresses.id')
  .orderBy('last_name')
  .then(contact => {
    res.render('contacts', { contact })
  })
  .catch(err => {
    next(err)
  })
})

// = GET FORMS PAGE TO CREATE A NEW CONTACT ==
router.get('/new', (req, res, next) => {
  console.log('IN ROUTER.GET /NEW');
  res.render('new')
})


// === GET FORMS PAGE FOR AN EXISTING CONTACT ==
router.get('/edit/:id', (req, res, next) => {
  console.log('IN ROUTER.GET /NEW')
  console.log('req.body is ', req.body)
  console.log('req.params is ', req.params, '\n');
  var idToBeEdited = req.params.id
  console.log('idToBeEdited', idToBeEdited)
  db('contacts')
  .innerJoin('addresses', 'addresses.id', 'contacts.address_id')
  .select('*', 'contacts.address_id as bob', 'addresses.id as mike')
  .where('contacts.id', idToBeEdited)
  .first()
  .then(contact => {
    console.log('contact is ', contact, '\n');
    res.render('new', {contact})
  })
  // db('contacts')
  // .select('*')
  // .where('id', idToBeEdited)
  // .then((contactToEdit) => {
  //   let newAddress = {
  //     line_1: req.body.line_1,
  //     line_2: req.body.line_2,
  //     city: req.body.city,
  //     zip: req.body.zip
  //   }
  //   console.log('result is ', contactToEdit)
  //   console.log(('newAddress is', newAddress));
  //   res.redirect('/')
  // })
})

//======== GET ONE CONTACT ========
router.get('/:id', function(req, res, next) {
  console.log('IN ROUTER.GET BY ID /:id');
  selectedId = req.params.id
  db('contacts')
  .select('contacts.id', 'first_name', 'last_name', 'phone_number', 'email_address', 'address_id', 'line_1', 'line_2', 'city', 'zip')
  .innerJoin('addresses', 'contacts.address_id', 'addresses.id')
  .where('contacts.id', selectedId)
  .then((contact)=> {
    console.log('========hey there=========');

    res.render('show', { contact })
  })
  .catch(err => {
    next(err)
  })
})

// ===== CREATE A NEW CONTACT ======
router.post('/', (req, res, next) => {
  console.log('IN ROUTER.POST /');
  let newAddress = {
    line_1: req.body.line_1,
    line_2: req.body.line_2,
    city: req.body.city,
    zip: req.body.zip
  }
  db('addresses')
  .insert(newAddress, '*')
  .then(insertedAddress => {
    let newContact = {
      first_name: req.body.first_name,
      last_name: req.body.last_name,
      phone_number: req.body.phone_number,
      email_address: req.body.email_address,
      address_id: insertedAddress[0].id,
    }
    return db('contacts')
    .insert(newContact)
    .returning('id')
  }).then(id => {
    res.redirect('/contacts')
  })
})

// ====== UPDATE ONE CONTACT ======
router.put('/:id', function(req, res, next) {
  console.log('IN ROUTER.PUT /:ID')
  let newAddress = {
    line_1: req.body.line_1,
    line_2: req.body.line_2,
    city: req.body.city,
    zip: req.body.zip
  }
  let newContact = {
    first_name: req.body.first_name,
    last_name: req.body.last_name,
    phone_number: req.body.phone_number,
    email_address: req.body.email_address,
  }
  let newContact_id = req.params.id
  db('contacts')
  .update(newContact)
  .where('id', newContact_id)
  .returning('address_id')
  .then(id => {
    db('addresses')
    .update(newAddress)
    .where('id', id[0])
    .then(() => {
      res.redirect('/contacts')
    })
  })
  .catch(err => {
    next(err)
  })
})

// ===== DELETE AN EXISTING CONTACT =====
router.delete('/:id',(req,res,next) => {
  console.log('IN ROUTER.DELETE /:ID');
  let id = req.params.id
  console.log('req/params.id is', req.params.id);
  db('contacts')
  .where('id', id)
  .select('*')
  .first()
  .then(result => {
    addressId = result.address_id
    db('contacts')
    .del()
    .where('id', id)
    .then( () => {
      db('contacts')
      .where('address_id', addressId)
      .count()
      .first()
      .then((result) => {
        var count = result.count
        if (count == 0) {
          db('addresses')
          .del()
          .where('id', addressId)
          .then( () => {
          })
        }
      })
    })
  })
  res.redirect('/contacts')
})


module.exports = router
