exports.seed = function (knex) {

  return knex('roles').select().then(roles => {

    return knex('users').insert([{
        username: "Frederik",
        password: '$2b$12$IDxNzdhYIlxm2aggkfVgf.cTlBTIzO/lw0sf0b8wQxAasr8PPW4VC', //password
        email: 'FSJ95@hotmail.dk',
        role_id: roles.find(role => role.role === 'ADMIN').id,
        avatar: 'frederik.jpg'
      },
      {
        username: "PeterParker",
        password: '$2b$12$IDxNzdhYIlxm2aggkfVgf.cTlBTIzO/lw0sf0b8wQxAasr8PPW4VC', //password
        email: 'notspiderman@avengers.com',
        role_id: roles.find(role => role.role === 'USER').id,
        avatar: 'spiderman.jpg'
      },
      {
        username: "Bond",
        password: '$2b$12$IDxNzdhYIlxm2aggkfVgf.cTlBTIzO/lw0sf0b8wQxAasr8PPW4VC', //password
        email: 'james@bond.com',
        role_id: roles.find(role => role.role === 'USER').id,
        avatar: 'bond.jpg'
      },
      {
        username: "HappyMan",
        password: '$2b$12$IDxNzdhYIlxm2aggkfVgf.cTlBTIzO/lw0sf0b8wQxAasr8PPW4VC', //password
        email: 'happyman@mail.com',
        role_id: roles.find(role => role.role === 'USER').id,
        avatar: 'user1.jpg'
      },
    ]);

  });


};