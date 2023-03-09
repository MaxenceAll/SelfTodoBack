// // // postgres DOC :
// // const Pool = require('pg').Pool;
// // require('dotenv').config();

// // const pool = new Pool ( {
// //     user: process.env.USERNAME,
// //     password: process.env.PASSWORD,
// //     host: process.env.HOST,
// //     port: process.env.DBPORT,
// //     database: 'todoapp'
// // })

// // module.exports = pool

// const mysql = require("mysql2/promise");
// require('dotenv').config();

// let db;
// async function connect() {
//   if (!db) {
//     console.log("new connexion made");    
//     db = await mysql.createConnection({
//         host: process.env.HOST,
//         port: process.env.PORT,
//         user: process.env.USER,
//         password: process.env.PASSWORD,
//         database: process.env.DATABASE
//     });
//   }  
//   return db;}



// module.exports = {connect};