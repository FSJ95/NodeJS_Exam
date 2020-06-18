exports.seed = function (knex) {

  return knex('users').select().then(users => {

    return knex('categories').select().then(categories => {

      var d = new Date();
      return knex('posts').insert([{
          user_id: users.find(user => user.username === "Frederik").id,
          title: "First post",
          category_id: categories.find(category => category.category === "Random").id,
          content: "This is my first post, its not very long but it's pretty cool! :)",
          createdAt: new Date(Date.now() - 86400000 * 0)

        },
        {
          user_id: users.find(user => user.username === "Frederik").id,
          title: "Exam help",
          category_id: categories.find(category => category.category === "Education").id,
          content: "I have a few exams very soon, does anyone have any tips for me?",
          createdAt: new Date(Date.now() - 86400000 * 4)

        },
        {
          user_id: users.find(user => user.username === "HappyMan").id,
          title: "Knock, knock ...",
          category_id: categories.find(category => category.category === "Jokes").id,
          content: "Who’s there? -- Luke. -- Luke who? -- Luke through the peep hole and find out.",
          createdAt: new Date(Date.now() - 86400000 * 1)

        },
        {
          user_id: users.find(user => user.username === "PeterParker").id,
          title: "PlayStation 5",
          category_id: categories.find(category => category.category === "Gaming").id,
          content: "The PlayStation 5 looks like my router xD",
          createdAt: new Date(Date.now() - 86400000 * 2)

        },
        {
          user_id: users.find(user => user.username === "Bond").id,
          title: "Telsa Stock !!!!",
          category_id: categories.find(category => category.category === "Finance").id,
          content: "TESLA STOCK WENT OVER 1000$ SELL SELL SELL",
          createdAt: new Date(Date.now() - 86400000 * 3)
        },
        {
          user_id: users.find(user => user.username === "Bond").id,
          title: "Favorite song?",
          category_id: categories.find(category => category.category === "Music").id,
          content: "Private message me your favorite songs, need a new intro melody!",
          createdAt: new Date(Date.now() - 86400000 * 5)
        },
      ]);

    });
  });

};