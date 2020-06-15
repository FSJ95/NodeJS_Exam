exports.seed = function (knex) {

    return knex('users').select().then(users => {

        return knex('posts').select().then(posts => {

            return knex('points').insert([{
                    user_id: users.find(user => user.username === "Admin").id,
                    post_id: 2,
                    points: 1
                },
                {
                    user_id: users.find(user => user.username === "Admin").id,
                    post_id: 3,
                    points: -1
                },
                {
                    user_id: users.find(user => user.username === "Admin").id,
                    post_id: 4,
                    points: -1
                },
                {
                    user_id: users.find(user => user.username === "PeterParker").id,
                    post_id: 2,
                    points: 1
                },

            ]);

        });
    });

};