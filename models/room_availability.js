const Sequelize = require('sequelize');

const sequelize = require('../controllers/database');

const RoomAvailability = sequelize.define('room_availability', {
    idRoomAvailability: {
        primaryKey: true,
        type: Sequelize.INTEGER,
        autoIncrement: true,
        allowNull: false
    },
    numOfAvailRooms: {
        type: Sequelize.INTEGER,
    }
    //FK of Roomtype
    //FK of Timeslot
});


module.exports = RoomAvailability;