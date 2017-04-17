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

// ========= GET FORMS PAGE ========
router.get('/new', (req, res, next) => {
  console.log('IN ROUTER.GET /NEW');
  res.render('new')
})


// ========= GET FORMS PAGE ========
router.get('/edit/:id', (req, res, next) => {
  console.log('IN ROUTER.GET /NEW');
  console.log('req.body is ', req.body);
  db('contacts')
  .select('*')
  .then((result) => {
    // haven't gotten it to populate the info yet - that goes here
    res.render('new', result)
  })
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
router.put('/new/:id', function(req, res, next) {
  console.log('IN ROUTER.PUT /:ID')
  console.log('req.body is',req.body);
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
  let id = req.params.id
  db('contacts')
  .update(newContact)
  .where('id', id)
  .first()
  .returning('address_id')
  .then((bobId) => {
    blah = bobId.address_id
    console.log('result is ', blah)
    db('addresses')
    .update(newAddress)
    .where('id', blah)
    .first()
    .then(() => {
      res.redirect(`/new/${blah}`)
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
