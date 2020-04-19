const Sequelize = require('sequelize');

const sequelize = require('../controllers/database');

const Timeslot = sequelize.define('timeslot', {
    idTimeslot: {
        primaryKey: true,
        type: Sequelize.INTEGER,
        autoIncrement: true,
        allowNull: false
    },
    name: {
        type: Sequelize.STRING,
    },
    order: {
        type: Sequelize.INTEGER
    }
    //FK of Timetable
});


module.exports = Timeslot;