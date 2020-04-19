const Sequelize = require('sequelize');

const sequelize = require('../controllers/database');

const Priority = sequelize.define('priority', {
    idPriority: {
        primaryKey: true,
        type: Sequelize.INTEGER,
        autoIncrement: true,
        allowNull: false
    },
    name: {
        type: Sequelize.STRING,
        allowNull: false
    }
});

module.exports = Priority;