
exports.seed = function(knex, Promise) {
  // Deletes ALL existing entries
  return knex('contacts').del()
    .then(function () {
      // Inserts seed entries
      return knex('contacts').insert([
        {
          id: 1,
          first_name: 'Genghis',
          last_name: 'Khan',
          phone_number: '555-555-5555',
          email_address: 'gkhan@gmail.com',
          address_id: 4
        },
        {
          id: 2,
          first_name: 'Fig',
          last_name: 'Newton',
          phone_number: '555-555-6666',
          email_address: 'fnewton@gmail.com',
          address_id: 3
        },
        {
          id: 3,
          first_name: 'Betty',
          last_name: 'White',
          phone_number: '555-555-7777',
          email_address: 'bwhite@gmail.com',
          address_id: 2
        },
        {
          id: 4,
          first_name: 'Markie',
          last_name: 'Mark',
          phone_number: '555-555-8888',
          email_address: 'mmark@gmail.com',
          address_id: 1
        }
      ]);
    })
    .then(() => {
      return knex.raw(
        "SELECT setval('contacts_id_seq', (SELECT MAX(id) FROM contacts));"
      )
    })
}
