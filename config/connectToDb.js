const knex = require('knex');


const dbClient = knex({
  client: 'mysql',
  connection: {
    host : '127.0.0.1',
    port : 3306,
    user : 'root',
    database : 'ecommerce',
  }
});

const dbClientSQLite3 = knex({
  client: 'sqlite3',
  connection: { filename: './DB/ecommerce.sqlite' },
  
 
});




module.exports = { dbClient, dbClientSQLite3 };
