const Sequelize = require('sequelize');

const sequelize = require('../controllers/database');

const UserPreferencesAvailibility = sequelize.define('user_preferences_availability', {
    idUserPreferencesAvailibility: {
        primaryKey: true,
        type: Sequelize.INTEGER,
        autoIncrement: true,
        allowNull: false
    },
    valuePreference: {
        type: Sequelize.INTEGER,
    },
    valueAvailability: {
        type: Sequelize.INTEGER,
    }
    //FK of user
    //FK of timeslot
});


module.exports = UserPreferencesAvailibility;