// id, first_name, last_name, phone_number, email_address, image_url
exports.up = (knex) => {
  return knex.schema.createTable('contacts', table => {
    table.increments()
    table.string('first_name').notNullable()
    table.string('last_name').notNullable()
    table.string('phone_number').notNullable()
    table.string('email_address').notNullable()
    table.integer('address_id').notNullable().references('id').inTable('addresses')
  })
}

exports.down = (knex) => {
  return knex.schema.dropTable('contacts')
}
