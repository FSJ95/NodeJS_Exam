// Update with your config settings.
const credentials = require('./config/mysqlCredentials.js');
const { knexSnakeCaseMappers } = require('objection');

module.exports = {

  development: {
    client: 'mysql',
    connection: {
      database: credentials.database,
      user: credentials.username,
      password: credentials.password
    },
    ...knexSnakeCaseMappers()
  }

};