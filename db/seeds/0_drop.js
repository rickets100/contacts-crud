
exports.seed = function(knex, Promise) {
  // Deletes ALL existing entries
  return knex('contacts').del().then(() => {
    return knex('addresses').del()
  })    
}
