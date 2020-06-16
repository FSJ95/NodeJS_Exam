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
            table.string('avatar').notNullable().defaultTo('defaultprofilepicture.png');

            table.integer('role_id').notNullable().unsigned();
            table.foreign('role_id').references('id').inTable('roles');

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

            table.dateTime('updated_at').defaultTo(knex.raw('NULL ON UPDATE CURRENT_TIMESTAMP'));
            table.dateTime('created_at').notNullable().defaultTo(knex.raw('CURRENT_TIMESTAMP'));
        })
        .createTable('points', (table) => {
            table.integer('points').notNullable();

            table.integer('user_id').notNullable().unsigned();
            table.foreign('user_id').references('id').inTable('users');

            table.integer('post_id').notNullable().unsigned();
            table.foreign('post_id').references('id').inTable('posts');
        })
        .createTable('messages', (table) => {
            table.increments('id');

            table.integer('sender_id').notNullable().unsigned();
            table.foreign('sender_id').references('id').inTable('users');

            table.integer('reciever_id').notNullable().unsigned();
            table.foreign('reciever_id').references('id').inTable('users');

            table.string('message');

            table.dateTime('updated_at').defaultTo(knex.raw('NULL ON UPDATE CURRENT_TIMESTAMP'));
            table.dateTime('created_at').notNullable().defaultTo(knex.raw('CURRENT_TIMESTAMP'));
        });

};

// DML = MANIPULATE = Select, Update, Delete.
// DDL = DEFINE = Create, Drop.

exports.down = function (knex) {
    return knex.schema
        .dropTableIfExists('messages')
        .dropTableIfExists('points')
        .dropTableIfExists('posts')
        .dropTableIfExists('users')
        .dropTableIfExists('roles')
        .dropTableIfExists('categories');
};