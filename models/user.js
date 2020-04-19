const Sequelize = require('sequelize');

const sequelize = require('../controllers/database');

const User = sequelize.define('user', {
    idUser: {
        primaryKey: true,
        type: Sequelize.INTEGER,
        autoIncrement: true,
        allowNull: false
    },
    name: {
        type: Sequelize.STRING,
        allowNull: false,
        unique: true
    },
    password: {
        type: Sequelize.STRING,
        allowNull: false
    },
    email: {
        type: Sequelize.STRING,
        allowNull: false
    }
    //FK of priority
});


module.exports = User;