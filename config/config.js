const e = require('express');

require('dotenv').config();
const env = process.env;

const development = {
  "username": env.DB_USERNAME,
  "password": env.DB_PASSWORD,
<<<<<<< Updated upstream
  "database": env.DB_NAME,
  "host": env.DB_HOST,
=======
  "database": "test_file",
  "host": "172.17.0.2",
>>>>>>> Stashed changes
  "dialect": "mysql"
};

const production = {
  "username": env.DB_USERNAME,
  "password": env.DB_PASSWORD,
<<<<<<< Updated upstream
  "database": env.DB_NAME,
  "host": env.DB_HOST,
=======
  "database": "test_file",
  "host": "172.17.0.2",
>>>>>>> Stashed changes
  "dialect": "mysql"
};

const test = {
  "username": env.DB_USERNAME,
  "password": env.DB_PASSWORD,
  "database": env.DB_NAME,
  "host": env.DB_HOST,
  "dialect": "mysql"
};

module.exports = { development, production, test };
