const Sequelize = require('sequelize');

const sequelize = require('../controllers/database');

const CoursesTimeslot = sequelize.define('courses_timeslots', {
    idCoursesTimeslot: {
        primaryKey: true,
        type: Sequelize.INTEGER,
        autoIncrement: true,
        allowNull: false
    },
    //FK of Course
    //FK of Timeslot
    //FK of Timetable
});


module.exports = CoursesTimeslot;