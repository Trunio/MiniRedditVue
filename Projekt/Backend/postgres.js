require("dotenv").config();
const { Client } = require("pg");
const client = new Client({
  // user: "postgres",
  // host: "localhost",
  // password: "tajne",
  // port: "5433",
  user: process.env.USERNAME,
  host: process.env.HOST,
  password: process.env.PASSWORD,
  port: process.env.PORT,
});
client.connect();
module.exports = client;
