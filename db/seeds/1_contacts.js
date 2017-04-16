
exports.seed = function(knex, Promise) {
  // Deletes ALL existing entries
  return knex('contacts')
    .then(function () {
      // Inserts seed entries
      return knex('contacts').insert([
        {
          id: 1,
          first_name: 'Genghis',
          last_name: 'Khan',
          phone_number: '555-555-4444',
          email_address: 'gkhan@gmail.com',
          address_id: 4
        },
        {
          id: 2,
          first_name: 'Fig',
          last_name: 'Newton',
          phone_number: '555-555-3333',
          email_address: 'fnewton@gmail.com',
          address_id: 3
        },
        {
          id: 3,
          first_name: 'Betty',
          last_name: 'White',
          phone_number: '555-555-2222',
          email_address: 'bwhite@gmail.com',
          address_id: 2
        },
        {
          id: 4,
          first_name: 'Markie',
          last_name: 'Mark',
          phone_number: '555-555-1111',
          email_address: 'mmark@gmail.com',
          address_id: 1
        },
        {
          id: 5,
          first_name: 'Bob',
          last_name: 'Hope',
          phone_number: '555-555-2222',
          email_address: 'bhope@comcast.net',
          address_id: 2
        },
        {
          id: 6,
          first_name: 'Abe',
          last_name: 'Vigoda',
          phone_number: '555-555-5555',
          email_address: 'avigoda@gmail.com',
          address_id: 5
        }
      ])
    })
    .then(() => {
      return knex.raw(
        "SELECT setval('contacts_id_seq', (SELECT MAX(id) FROM contacts))"
      )
    })
}
