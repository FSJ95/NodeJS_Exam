exports.seed = function (knex) {

    return knex('categories').insert([{
            category: 'Random'
        },
        {
            category: 'Jokes'
        },
        {
            category: 'Gaming'
        },
        {
            category: 'Finance'
        },
        {
            category: 'Education'
        },
        {
            category: 'Music'
        }
    ]);
};