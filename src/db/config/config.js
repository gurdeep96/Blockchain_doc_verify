require("dotenv").config();
module.exports = {
  development: {
    username: process.env.DB_NAME,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_SCHEMA,
    host: process.env.DB_HOST,
    dialect: "mysql",
  },
  test: {
    username: "postgres",
    password: process.env.DB_PASSWORD,
    database: process.env.DB_SCHEMA,
    host: process.env.DB_HOST,
    dialect: "postgres",
  },
  production: {
    username: "root",
    password: null,
    database: "database_production",
    host: "127.0.0.1",
    dialect: "mysql",
  },
};
