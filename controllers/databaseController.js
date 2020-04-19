// models
const User = require('../models/user');
const Priority = require('../models/priority');
const Course = require('../models/course');
const Roomtype = require('../models/roomtype');
const Timeslot = require('../models/timeslot');
const Timetable = require('../models/timetable');
const UserPreferencesAvailibility = require('../models/user_preferences_availability');
const RoomAvailability = require('../models/room_availability');
const CoursesTimeslot = require('../models/courses_timeslots');
const Room = require('../models/room.js');

// controllers
const inCon = require('./inputController');


// Deletes all data in all tables (is written like this due to otherwise thrown deadlock)
exports.deleteAllData = () => {
    return Roomtype.destroy({where: {}}).then(() => {
        Timetable.destroy({where: {}}).then(() => {
            Priority.destroy({where: {}}).then(() => {
                User.destroy({where: {}}).then(() => {
                    Room.destroy({where: {}}).then(() => {
                        Timeslot.destroy({where: {}}).then(() => {
                            Course.destroy({where: {}}).then(() => {
                                UserPreferencesAvailibility.destroy({where: {}}).then(() => {
                                    RoomAvailability.destroy({where: {}}).then(() => {
                                        CoursesTimeslot.destroy({where: {}})
                                    });
                                });
                            });
                        });
                    });
                });
            });
        });
    });
}

// Create scripts

// returns promise true/false if creation was sucessfull
exports.createTimetable = (name, days, timestart, timepause, timeslotduration, numofslotsinaday) => {
    if (! inCon.checkNullOrEmpty(name, days, timestart, timepause, timeslotduration, numofslotsinaday)) {
        return Promise.resolve(false);
    }
    const daysString = inCon.createDayString(days);
    if (! inCon.checkTableInputs(timestart, timepause, timeslotduration, numofslotsinaday)) {
        return Promise.resolve(false);
    }
    Timetable.create({
        name: name,
        timestart: timestart,
        timepause: timepause,
        timeslotduration: timeslotduration,
        numofslotsinaday: numofslotsinaday,
        days: daysString
    });
    return Promise.resolve(true);
};

// returns promise true/false if creation was sucessfull
exports.createCourse = (name, idUser, idRoomtype, idTimetable) => {
    if (! inCon.checkNullOrEmpty(name, idUser, idRoomtype, idTimetable)) {
        return Promise.resolve(false);
    }
    Course.create({name: name, idUser: idUser, idRoomtype: idRoomtype, idTimetable: idTimetable});
    return Promise.resolve(true);
};

// returns promise true/false if creation was sucessfull
exports.createRoom = (name, idRoomtype) => {
    if (! inCon.checkNullOrEmpty(name, idRoomtype)) {
        return Promise.resolve(false);
    }
    Room.create({name: name, idRoomtype: idRoomtype});
    return Promise.resolve(true);
};

// returns promise true/false if creation was sucessfull
exports.createRoomType = (name) => {
    if (! inCon.checkNullOrEmpty(name)) {
        return Promise.resolve(false);
    }
    Roomtype.create({name: name});
    return Promise.resolve(true);
};


// Update requests

// updates user priority with given idUser and idPriority
exports.updateUserPriority = (idUser, idPriority) => {
    User.findAll({
        where: {
            idUser: idUser
        }
    }).then((user) => {
        user[0].idPriority = idPriority;
        user[0].save();
    });
}

// More specific getters

// returns promise of All Timeslots with idTimetable
exports.getAllRoomAvailabilitiesWithIdRoomtype = (idRoomtype) => {
    return RoomAvailability.findAll({
        where: {
            idRoomtype: idRoomtype
        }
    });
}

// returns promise of All Timeslots with idTimetable
exports.getAlluserPreferencesAvailablitiesWithIdUser = (idUser) => {
    return UserPreferencesAvailibility.findAll({
        where: {
            idUser: idUser
        }
    });
}

// returns promise of All Timeslots with idTimetable
exports.getAllTimeslotsWithIdTimetableIncludeAll = (idTimetable) => {
    return Timeslot.findAll({
        where: {
            idTimetable: idTimetable
        },
        include: [
            {
                all: true
            }
        ]
    });
}

// returns promise (array of 1 found Timetable) with idTimetable parameter
exports.getTimetableWithId = (idTimetable) => {
    return Timetable.findAll({
        where: {
            idTimetable: idTimetable
        }
    });
};

// Standard getters of all values without filters

// returns promise of all Users from database
exports.getAllUsers = () => {
    return User.findAll();
};

// returns promise of all Users from database
exports.getAllRoomtypes = () => {
    return Roomtype.findAll();
};

// returns promise of all Priorities from database
exports.getAllPriorities = () => {
    return Priority.findAll();
};

// returns promise of all Timeslots from database
exports.getAllTimeslots = () => {
    return Timeslot.findAll();
};

// returns promise of all Timetables from database
exports.getAllTimetables = () => {
    return Timetable.findAll();
};

// returns promise of all UserPreferencesAvailibilities from database
exports.getAllUserPreferencesAvailibilities = () => {
    return UserPreferencesAvailibility.findAll();
};

// returns promise of all RoomAvailabilities from database
exports.getAllRoomAvailabilities = () => {
    return RoomAvailability.findAll();
};

// returns promise of all Courses from database
exports.getAllCourses = () => {
    return Course.findAll();
};

// returns promise of all CoursesTimeslots from database
exports.CoursesTimeslots = () => {
    return CoursesTimeslot.findAll();
};

// returns promise of all Rooms from database
exports.getAllRooms = () => {
    return Room.findAll();
};
