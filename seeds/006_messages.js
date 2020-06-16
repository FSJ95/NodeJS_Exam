exports.seed = function (knex) {

    return knex('users').select().then(users => {

        return knex('messages').insert([{
                sender_id: users.find(user => user.username === "Admin").id,
                reciever_id: users.find(user => user.username === "PeterParker").id,
                message: "Hey Peter, are you spiderman?",
                createdAt: new Date(Date.now() - 86400000 * 3)
            },
            {
                sender_id: users.find(user => user.username === "PeterParker").id,
                reciever_id: users.find(user => user.username === "Admin").id,
                message: "EHMMM? NO!",
                createdAt: new Date(Date.now() - 86400000 * 2)
            },
            {
                sender_id: users.find(user => user.username === "PeterParker").id,
                reciever_id: users.find(user => user.username === "Admin").id,
                message: "Why would you ask that??!?!",
                createdAt: new Date(Date.now() - 86400000 * 1)
            },
            {
                sender_id: users.find(user => user.username === "Admin").id,
                reciever_id: users.find(user => user.username === "PeterParker").id,
                message: ";)",
                createdAt: new Date(Date.now() - 86400000 * 0)
            },

        ]);

    });
};