exports.seed = function (knex) {
  // Deletes ALL existing entries
  return knex('users').del()
    .then(function () {
      return knex('roles').del();
    })
    .then(function () {
      return knex('categories').del();
    })
    .then(function () {
      return knex('posts').del();
    });
};