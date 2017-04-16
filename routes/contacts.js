var express = require('express')
var router = express.Router()
var db = require('../db/connection')

//======== GET ALL CONTACTS ========
router.get('/', function(req, res, next) {
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
  res.render('new')
})

//======== GET ONE CONTACT ========
router.get('/:id', function(req, res, next) {
  selectedId = req.params.id
  db('contacts')
    .select('contacts.id', 'first_name', 'last_name', 'phone_number', 'email_address', 'address_id', 'line_1', 'line_2', 'city', 'zip')
    .innerJoin('addresses', 'contacts.address_id', 'addresses.id')
    .where('contacts.id', selectedId)
    .then((contact)=> {
      console.log('contact.id is', contact.id)
    })
    .then(() => {
      console.log('========hey there=========');
    })
    .then(contact => {
      res.render('show', { contact })
    })
  .catch(err => {
    next(err)
  })
})

// ========= EDIT ONE CONTACT ========
router.get('/:id/edit', (req, res, next) => {
  var id = req.params.id
  console.log('================********')
  console.log(req.body)
  db('contacts').select('*')
  .where({ id })
  .first().then(contact => {
      res.render('contacts/edit', { contact })
    })
})

// ===== CREATE A NEW CONTACT ======
// create a new contact, with the proviso:
// if req.params.addressId is not in addresses table,
// else (this means the address already exists)
// make the addressId field of the new contact = req.params.addressId

router.post('/', (req, res, next) => {
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
  var address = {
    line_1: req.body.line_1,
    line_2: req.body.line_2,
    phone_number: req.body.city,
    email_address: req.body.zip
  }

  var contact = {
    first_name: req.body.first_name,
    last_name: req.body.last_name,
    phone: req.body.phone_number,
    email: req.body.email_address
  }
  db('contacts')
  .update(contact, '*')
  .where({ id })
  .then(deletedContact => {
    var id = deletedContact[0].id
    res.redirect(`/`)
  })
  .catch(err => {
    next(err)
  })
})

// ===== DELETE AN EXISTING CONTACT =====
router.delete('/:id',(req,res,next) => {
    let id = req.params.id
    let addressId = -1
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
