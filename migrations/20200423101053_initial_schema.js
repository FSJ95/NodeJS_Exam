exports.up = function (knex) {
    return knex.schema
        .createTable('roles', (table) => {
            table.increments('id');
            table.string('role').unique().notNullable();
        })
        .createTable('categories', (table) => {
            table.increments('id');
            table.string('category').notNullable();
        })
        .createTable('users', (table) => {
            table.increments('id');
            table.string('username').unique().notNullable();
            table.string('password').notNullable();
            table.string('email').notNullable();
            table.integer('age');

            table.integer('role_id').notNullable().unsigned();
            table.foreign('role_id').references('id').inTable('');

            table.dateTime('updated_at').defaultTo(knex.raw('NULL ON UPDATE CURRENT_TIMESTAMP'));
            table.dateTime('created_at').notNullable().defaultTo(knex.raw('CURRENT_TIMESTAMP'));

        })
        .createTable('posts', (table) => {
            table.increments('id');

            table.integer('user_id').notNullable().unsigned();
            table.foreign('user_id').references('id').inTable('users');

            table.integer('category_id').notNullable().unsigned();
            table.foreign('category_id').references('id').inTable('categories');

            table.string('title').notNullable();
            table.string('content').notNullable();
            table.integer('points').notNullable().defaultTo(0);

            table.dateTime('updated_at').defaultTo(knex.raw('NULL ON UPDATE CURRENT_TIMESTAMP'));
            table.dateTime('created_at').notNullable().defaultTo(knex.raw('CURRENT_TIMESTAMP'));
        });

};

// DML = MANIPULATE = Select, Update, Delete.
// DDL = DEFINE = Create, Drop.

exports.down = function (knex) {
    return knex.schema
        .dropTableIfExists('roles')
        .dropTableIfExists('posts')
        .dropTableIfExists('categories')
        .dropTableIfExists('users');
};