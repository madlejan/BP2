const Sequelize = require('sequelize');

const sequelize = require('../controllers/database');

const course = sequelize.define('course', {
    idCourse: {
        primaryKey: true,
        type: Sequelize.INTEGER,
        autoIncrement: true,
        allowNull: false
    },
    name: {
        type: Sequelize.STRING,
        allowNull: false
    }
    // FK of User
    // FK of Roomtype
    // FK of Timetable
    // FK of Room
});

module.exports = course;
