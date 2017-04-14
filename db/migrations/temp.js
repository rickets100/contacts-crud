exports.up = function(knex, Promise) {
  return createAddressTable()
    .then(createMemberTable);

  function createMemberTable() {
    return knex.schema.createTable('contacts', function (table) {
      table.bigIncrements('id').primary().unsigned();
      table.string('first_name').notNullable()
      table.string('last_name').notNullable()
      table.string('phone_number').notNullable()
      table.string('email_address').notNullable()

      /* CREATE FKS */
      table.bigInteger('AddressId').unsigned().index().inTable('Address').references('id');
    });
  }

  function createAddressTable() {
    return knex.schema.createTable('Address', function (table) {
      table.bigIncrements('id').primary().unsigned();
      table.string('line_1').notNullable()
      table.string('line_2').notNullable()
      table.string('city').notNullable()
      table.string('zip').notNullable()
    });
  }
};
