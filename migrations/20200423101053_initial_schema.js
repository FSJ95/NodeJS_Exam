exports.up = function (knex) {
    return knex.schema
        .createTable('roles', (table) => {
            table.increments('id').notNullable();
            table.string('role').unique().notNullable();
        })
        .createTable('users', (table) => {
            table.increments('id');
            table.string('username').unique().notNullable();
            table.string('password').notNullable();
            table.string('email').notNullable();
            table.integer('age');
            table.integer('role_id').notNullable().unsigned();
            table.foreign('role_id').references('id').inTable('roles');

            table.dateTime('updated_at').defaultTo(knex.raw('NULL ON UPDATE CURRENT_TIMESTAMP'));
            table.dateTime('created_at').notNullable().defaultTo(knex.raw('CURRENT_TIMESTAMP'));

        });
};

// DML = MANIPULATE = Select, Update, Delete.
// DDL = DEFINE = Create, Drop.

exports.down = function (knex) {
    return knex.schema
        .dropTableIfExists('users')
        .dropTableIfExists('roles');
};