const Sequelize = require('sequelize');

const sequelize = require('../controllers/database');

const Timetable = sequelize.define('timetable', {
    idTimetable: {
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
    timestart: {
        type: Sequelize.STRING,
        //allowNull: false,
    },
    timepause: {
        type: Sequelize.INTEGER,
        //allowNull: false,
    },
    timeslotduration: {
        type: Sequelize.INTEGER,
        //allowNull: false,
    },
    days: {
        type: Sequelize.STRING,
        //allowNull: false,
    },
    numofslotsinaday: {
        type: Sequelize.INTEGER,
        //allowNull: false,
    },
});


module.exports = Timetable;