const mysql = require("mysql2/promise");
require('dotenv').config();

const {connect} = require('./database.connexion')


async function query(sql, params = []) {
    console.log("query method called")
    const connection = await connect();
    const statement = await connection.prepare(sql);
    // console.log("sql:",sql)
    // console.log("statement:",statement)
    const [rows] = await statement.execute(params);
    console.log("rows:",rows)
    return rows;
  }

  module.exports = {query};