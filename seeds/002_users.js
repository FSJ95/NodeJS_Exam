exports.seed = function (knex) {

  return knex('roles').select().then(roles => {

    return knex('users').insert([{
      username: "Admin",
      password: '$2b$12$IDxNzdhYIlxm2aggkfVgf.cTlBTIzO/lw0sf0b8wQxAasr8PPW4VC', //password
      email: 'FSJ95@hotmail.dk', //password
      age: 24,
      role_id: roles.find(role => role.role === 'ADMIN').id
    }, ]);

  });


};