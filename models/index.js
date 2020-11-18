const Sequelize = require('sequelize');

const env = process.env.NODE_ENV || 'development'; // production
const config = require('../config/config')[env];

const sequelize = new Sequelize(config.database, config.username, config.password, config);

const db = {};

db.sequelize = Sequelize;
db.sequelize = sequelize;

db.report_tbl = require('./report')(sequelize, Sequelize);
db.notice_tbl = require('./notice')(sequelize, Sequelize);

module.exports = db;