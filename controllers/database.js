const Sequelize = require('sequelize');

// automaticly creates connection pool
const sequelize = new Sequelize('testuserDB','root','', {dialect: 'mariadb', host: 'localhost', logging: false});

module.exports = sequelize;