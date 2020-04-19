const Sequelize = require('sequelize');
const sequelize = require('../controllers/database');

const Room = sequelize.define('room', {
    idRoom: {
        primaryKey: true,
        type: Sequelize.INTEGER,
        autoIncrement: true,
        allowNull: false
    },
    name: {
        type: Sequelize.STRING,
        allowNull: false,
        unique: true
    }
    //FK of Roomtype
});

module.exports = Room;