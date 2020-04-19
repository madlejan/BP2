// scripts
const timeManipulator = require('../scripts/time_manipulator');

const User = require('./user');
const Priority = require('./priority');
const Course = require('./course');
const Roomtype = require('./roomtype');
const Timeslot = require('./timeslot');
const Timetable = require('./timetable');
const UserPreferencesAvailibility = require('./user_preferences_availability');
const RoomAvailability = require('./room_availability');
const CoursesTimeslot = require('./courses_timeslots');
const Room = require('./room.js');

// Room
// add FK of Roomtype to Room
Room.belongsTo(Roomtype, {foreignKey: 'idRoomtype', foreignKeyConstraint: true});
Roomtype.hasMany(Room, {foreignKey: 'idRoomtype', foreignKeyConstraint: true});

// User
// add FK of priority to User
User.belongsTo(Priority, {foreignKey: 'idPriority', foreignKeyConstraint: true});
Priority.hasMany(User, {foreignKey: 'idPriority', foreignKeyConstraint: true});

// Cource
// add FK of User to Course
Course.belongsTo(User, {foreignKey: 'idUser', foreignKeyConstraint: true});
User.hasMany(Course, {foreignKey: 'idUser', foreignKeyConstraint: true});
// add FK of Roomtype to Cource
Course.belongsTo(Roomtype, {foreignKey: 'idRoomtype', foreignKeyConstraint: true});
Roomtype.hasMany(Course, {foreignKey: 'idRoomtype', foreignKeyConstraint: true});
// add FK of Timetable to Cource
Course.belongsTo(Timetable, {foreignKey: 'idTimetable', foreignKeyConstraint: true});
Timetable.hasMany(Course, {foreignKey: 'idTimetable', foreignKeyConstraint: true});
// add FK of Room to Cource
Course.belongsTo(Room, {foreignKey: 'idRoom', foreignKeyConstraint: true});
Room.hasMany(Course, {foreignKey: 'idRoom', foreignKeyConstraint: true});

// CoursesTimeslot
// add FK of Course to CoursesTimeslot
CoursesTimeslot.belongsTo(Course, {foreignKey: 'idCourse', foreignKeyConstraint: true});
Course.hasMany(CoursesTimeslot, {foreignKey: 'idCourse', foreignKeyConstraint: true});
// add FK of Timeslot to CoursesTimeslot
CoursesTimeslot.belongsTo(Timeslot, {foreignKey: 'idTimeslot', foreignKeyConstraint: true});
Timeslot.hasMany(CoursesTimeslot, {foreignKey: 'idTimeslot', foreignKeyConstraint: true});
// add FK of Timetable to CoursesTimeslot
CoursesTimeslot.belongsTo(Timetable, {foreignKey: 'idTimetable', foreignKeyConstraint: true});
Timetable.hasMany(CoursesTimeslot, {foreignKey: 'idTimetable', foreignKeyConstraint: true});
// add FK of Room to CoursesTimeslot
CoursesTimeslot.belongsTo(Room, {foreignKey: 'idRoom', foreignKeyConstraint: true});
Room.hasMany(CoursesTimeslot, {foreignKey: 'idRoom', foreignKeyConstraint: true});

// Timeslot
// add FK of Timetable to Timeslot
Timeslot.belongsTo(Timetable, {foreignKey: 'idTimetable', foreignKeyConstraint: true});
Timetable.hasMany(Timeslot, {foreignKey: 'idTimetable', foreignKeyConstraint: true});

// UserPreferencesAvailibility
// add FK of User to UserPreferencesAvailibility
UserPreferencesAvailibility.belongsTo(User, {foreignKey: 'idUser', foreignKeyConstraint: true});
User.hasMany(UserPreferencesAvailibility, {foreignKey: 'idUser', foreignKeyConstraint: true});
// add FK of Timeslot to UserPreferencesAvailibility
UserPreferencesAvailibility.belongsTo(Timeslot, {foreignKey: 'idTimeslot', foreignKeyConstraint: true});
Timeslot.hasMany(UserPreferencesAvailibility, {foreignKey: 'idTimeslot', foreignKeyConstraint: true});

// RoomAvailability
// add FK of Roomtype to RoomAvailability
RoomAvailability.belongsTo(Roomtype, {foreignKey: 'idRoomtype', foreignKeyConstraint: true});
Roomtype.hasMany(RoomAvailability, {foreignKey: 'idRoomtype', foreignKeyConstraint: true});
// add FK of Timeslot to RoomAvailability
RoomAvailability.belongsTo(Timeslot, {foreignKey: 'idTimeslot', foreignKeyConstraint: true});
Timeslot.hasMany(RoomAvailability, {foreignKey: 'idTimeslot', foreignKeyConstraint: true});


// hooks also known as triggers:

// hook for creating timeslots after creating a new Timetable
Timetable.afterCreate(timetable => {
    timeManipulator.createTimeslots(timetable);
});

// hook for creating CoursesTimeslots after creating a new Course
Course.afterCreate(course => {
    CoursesTimeslot.create({
        idCourse: course.idCourse,
        idTimetable: course.idTimetable
    });
});

// hook for creating user available and preference settings after creating a new Timeslot
// and hook for creating room availablity after creating a new typeslot
Timeslot.afterCreate(timeslot => {
    const getAllUsers = User.findAll();
    Promise.all([getAllUsers]).then(responces => {
        const users = responces[0];
        users.forEach(user => {
            UserPreferencesAvailibility.create({idTimeslot: timeslot.idTimeslot, idUser: user.idUser, valuePreference: 0, valueAvailability: 0})
        });
    });
    const getAllRoomtypes = Roomtype.findAll();
    Promise.all([getAllRoomtypes]).then(responces => {
        const roomtypes = responces[0];
        roomtypes.forEach(roomtype => {
            RoomAvailability.create({idTimeslot: timeslot.idTimeslot, idRoomtype: roomtype.idRoomtype, numOfAvailRooms: 0})
        });
    });
});

// hook for creating user available and preference settings after creating a new user
User.afterCreate(user => {
    const getAllTimeslots = Timeslot.findAll();
    Promise.all([getAllTimeslots]).then(responces => {
        const timeslots = responces[0];
        timeslots.forEach(timeslot => {
            UserPreferencesAvailibility.create({idTimeslot: timeslot.idTimeslot, idUser: user.idUser, valuePreference: 0, valueAvailability: 0})
        });
    })
});

// hook for creating room availablity after creating a new room type
Roomtype.afterCreate(roomtype => {
    const getAllTimeslots = Timeslot.findAll();
    Promise.all([getAllTimeslots]).then(responces => {
        const timeslots = responces[0];
        timeslots.forEach(timeslot => {
            RoomAvailability.create({idTimeslot: timeslot.idTimeslot, idRoomtype: roomtype.idRoomtype, numOfAvailRooms: 0})
        });
    })
});

// Room hook
// hook for updating number of rooms when new room is added
Room.afterCreate(room => {
    const getAllRoomAvails = RoomAvailability.findAll({where:{idRoomtype: room.idRoomtype}});
    Promise.all([getAllRoomAvails]).then(responces => {
        const roomavails = responces[0];
        roomavails.forEach(roomavail => {
            roomavail.numOfAvailRooms = roomavail.numOfAvailRooms + 1;
            roomavail.save();
        });
    })
});

// Destroy hooks

// hook for deleting roomavailabilities.
Roomtype.afterBulkDestroy(roomtype => {
    const getAllRoomAvailability = RoomAvailability.findAll({where: {idRoomtype: null}});
    Promise.all([getAllRoomAvailability]).then(responces => {
        const roomAvailabilities = responces[0];
        roomAvailabilities.forEach(roomavail => {
            roomavail.destroy();
    });
})});

// hook for deleting roomavailabilities.
Course.afterBulkDestroy(course => {
    const getAllCoursesTimeslot = CoursesTimeslot.findAll({where: {idCourse: null}});
    Promise.all([getAllCoursesTimeslot]).then(responces => {
        const coursesTimeslot = responces[0];
        coursesTimeslot.forEach(coursesTimeslot => {
            coursesTimeslot.destroy();
            console.log("jo");
    });
})});