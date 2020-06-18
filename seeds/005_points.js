exports.seed = function (knex) {

    return knex('users').select().then(users => {

        return knex('posts').select().then(posts => {

            return knex('points').insert([{
                    user_id: users.find(user => user.username === "Frederik").id,
                    post_id: 1,
                    points: 1
                },
                {
                    user_id: users.find(user => user.username === "Frederik").id,
                    post_id: 2,
                    points: -1
                },
                {
                    user_id: users.find(user => user.username === "Frederik").id,
                    post_id: 3,
                    points: 0
                },
                {
                    user_id: users.find(user => user.username === "Frederik").id,
                    post_id: 4,
                    points: -1
                },
                {
                    user_id: users.find(user => user.username === "Frederik").id,
                    post_id: 5,
                    points: 1
                },
                {
                    user_id: users.find(user => user.username === "Bond").id,
                    post_id: 1,
                    points: -1
                },
                {
                    user_id: users.find(user => user.username === "Bond").id,
                    post_id: 2,
                    points: 1
                },
                {
                    user_id: users.find(user => user.username === "Bond").id,
                    post_id: 3,
                    points: 1
                },
                {
                    user_id: users.find(user => user.username === "Bond").id,
                    post_id: 4,
                    points: 0
                },
                {
                    user_id: users.find(user => user.username === "Bond").id,
                    post_id: 5,
                    points: 1
                },
                {
                    user_id: users.find(user => user.username === "PeterParker").id,
                    post_id: 1,
                    points: 1
                },
                {
                    user_id: users.find(user => user.username === "PeterParker").id,
                    post_id: 2,
                    points: 1
                },
                {
                    user_id: users.find(user => user.username === "PeterParker").id,
                    post_id: 3,
                    points: 1
                },
                {
                    user_id: users.find(user => user.username === "PeterParker").id,
                    post_id: 4,
                    points: 1
                },
                {
                    user_id: users.find(user => user.username === "PeterParker").id,
                    post_id: 5,
                    points: 1
                },
                {
                    user_id: users.find(user => user.username === "HappyMan").id,
                    post_id: 1,
                    points: 0
                },
                {
                    user_id: users.find(user => user.username === "HappyMan").id,
                    post_id: 2,
                    points: 1
                },
                {
                    user_id: users.find(user => user.username === "HappyMan").id,
                    post_id: 3,
                    points: 0
                },
                {
                    user_id: users.find(user => user.username === "HappyMan").id,
                    post_id: 4,
                    points: 1
                },
                {
                    user_id: users.find(user => user.username === "HappyMan").id,
                    post_id: 5,
                    points: -1
                },

            ]);

        });
    });

};