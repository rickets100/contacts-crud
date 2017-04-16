
exports.seed = function(knex, Promise) {
  // Deletes ALL existing entries
  return knex('addresses')
    .then(function () {
      // Inserts seed entries
      return knex('addresses').insert([
        {
          id: 1,
          line_1: '12',
          line_2: 'Bailey St.',
          city: 'Springfield',
          zip: '11111'
        },
        {
          id: 2,
          line_1: '34',
          line_2:  'Bailey St.',
          city: 'Moscow',
          zip: '22222'
        },
        {
          id: 3,
          line_1: '56',
          line_2:  'Blink St.',
          city: 'Boston',
          zip: '33333'
        },
        {
          id: 4,
          line_1: '78',
          line_2: 'Marmot St.',
          city: 'Dubuque',
          zip: '44444'
        },
        {
          id: 5,
          line_1: '4432',
          line_2: 'Cascade St.',
          city: 'Ames',
          zip: '55555'
        }
      ])
    })
    .then(() => {
      return knex.raw(
        "SELECT setval('addresses_id_seq', (SELECT MAX(id) FROM addresses))"
      )
    })
}
