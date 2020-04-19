const Sequelize = require('sequelize');

const sequelize = require('../controllers/database');

const Roomtype = sequelize.define('roomtype', {
    idRoomtype: {
        primaryKey: true,
        type: Sequelize.INTEGER,
        autoIncrement: true,
        allowNull: false
    },
    name: {
        type: Sequelize.STRING
    }
});

module.exports = Roomtype;