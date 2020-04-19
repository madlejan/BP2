const express = require('express');
const router = express.Router();

const redirections = require('./redirections.js');

// controllers
const encryptController = require('../controllers/encryptController');
const sessionController = require('../controllers/sessionController.js');
const sequelize = require('../controllers/database');
const dbc = require('../controllers/databaseController');

// models
const User = require('../models/user.js');
const Roomtype = require('../models/roomtype.js');
const Course = require('../models/course.js');
const CoursesTimeslots = require('../models/courses_timeslots.js');
const UserPreferencesAvailibility = require('../models/user_preferences_availability.js');
const RoomAvailability = require('../models/room_availability.js');
const Room = require('../models/room.js');

// scripts
const timeManipulator = require('../scripts/time_manipulator.js');
const solverParser = require('../scripts/solver_parser.js');
const timetableTests = require('../scripts/timetable_tests.js');

// manages all possible GET and POST request and loads (renders) proper data with defined .ejs template, and send this HTML data to user.

router.get('/', redirections.redirectLogin, redirections.redirectHome);

router.get('/tests', redirections.redirectLogin, (req, res) => {
    res.render('tests', {user: sessionController.getLoggedUser(req)});
});

router.get('/home', redirections.redirectLogin, (req, res) => {
    res.render('home', {user: sessionController.getLoggedUser(req)});
});

router.get('/solver', redirections.redirectLogin, (req, res) => {
    Promise.all([dbc.getAllTimetables()]).then(responces => {
        res.render('solver', {
            user: sessionController.getLoggedUser(req),
            timetables: responces[0]
        });
    });
});

router.get('/timetable', redirections.redirectLogin, (req, res) => {
    Promise.all([dbc.getAllTimetables(), dbc.getAllUsers()]).then(responces => {
        res.render('timetable', {
            user: sessionController.getLoggedUser(req),
            timetables: responces[0],
            users: responces[1]
        });
    });
});

router.get('/editavailability', redirections.redirectLogin, (req, res) => {
    Promise.all([dbc.getAllTimetables(),dbc.getAllUsers()]).then(responces => {
        res.render('./edits/editavailability', {
            user: sessionController.getLoggedUser(req),
            timetables: responces[0],
            users: responces[1]
        });
    });
});

router.get('/editpreferences', redirections.redirectLogin, (req, res) => {
    Promise.all([dbc.getAllTimetables(),dbc.getAllUsers()]).then(responces => {
        res.render('./edits/editpreferences', {
            user: sessionController.getLoggedUser(req),
            timetables: responces[0],
            users: responces[1]
        });
    });
});
router.get('/editroomavailabilities', redirections.redirectLogin, (req, res) => {
    Promise.all([dbc.getAllTimetables(), dbc.getAllRoomtypes()]).then(responces => {
        res.render('./edits/editroomavailabilities', {
            user: sessionController.getLoggedUser(req),
            timetables: responces[0],
            roomtypes: responces[1]
        });
    });
});

router.get('/getPreferencestableForUser', redirections.redirectLogin, (req, res) => {
    const {idUser, idTimetable} = req.query;
    const timeslots = dbc.getAllTimeslotsWithIdTimetableIncludeAll(idTimetable);
    const timetables = dbc.getTimetableWithId(idTimetable);
    const userPreferencesAvailablities = dbc.getAlluserPreferencesAvailablitiesWithIdUser(idUser);
    Promise.all([timeslots, timetables, userPreferencesAvailablities]).then(responces => {
        res.render('./loads/preferencestable', {
            user: sessionController.getLoggedUser(req),
            timeslots: responces[0],
            timetables: responces[1],
            arrtimeslotstext: timeManipulator.getTimeTexts(responces[1][0].timestart, responces[1][0].timepause, responces[1][0].timeslotduration, responces[1][0].numofslotsinaday),
            arrdays: timeManipulator.getDays(responces[1][0].days),
            numofslotsinaday: responces[1][0].numofslotsinaday,
            userPreferencesAvailablity: responces[2],
            selectedUserId: idUser
        });
    });
});

router.get('/getRoomAvailabilitiestable', redirections.redirectLogin, (req, res) => {
    const {idRoomtype, idTimetable} = req.query;
    const timeslots = dbc.getAllTimeslotsWithIdTimetableIncludeAll(idTimetable);
    const timetables = dbc.getTimetableWithId(idTimetable);
    const roomavailabilities = dbc.getAllRoomAvailabilitiesWithIdRoomtype(idRoomtype);
    Promise.all([timeslots, timetables, roomavailabilities]).then(responces => {
        res.render('./loads/roomavailabilities', {
            user: sessionController.getLoggedUser(req),
            timeslots: responces[0],
            timetables: responces[1],
            arrtimeslotstext: timeManipulator.getTimeTexts(responces[1][0].timestart, responces[1][0].timepause, responces[1][0].timeslotduration, responces[1][0].numofslotsinaday),
            arrdays: timeManipulator.getDays(responces[1][0].days),
            numofslotsinaday: responces[1][0].numofslotsinaday,
            roomavailabilities: responces[2]
        });
    });
});

router.get('/getAvailabilitiestableForUser', redirections.redirectLogin, (req, res) => {
    const {idUser, idTimetable} = req.query;
    const timeslots = dbc.getAllTimeslotsWithIdTimetableIncludeAll(idTimetable);
    const timetables = dbc.getTimetableWithId(idTimetable);
    const userPreferencesAvailablity = dbc.getAlluserPreferencesAvailablitiesWithIdUser(idUser);
    Promise.all([timeslots, timetables, userPreferencesAvailablity]).then(responces => {
        res.render('./loads/availabilitiestable', {
            user: sessionController.getLoggedUser(req),
            timeslots: responces[0],
            timetables: responces[1],
            arrtimeslotstext: timeManipulator.getTimeTexts(responces[1][0].timestart, responces[1][0].timepause, responces[1][0].timeslotduration, responces[1][0].numofslotsinaday),
            arrdays: timeManipulator.getDays(responces[1][0].days),
            numofslotsinaday: responces[1][0].numofslotsinaday,
            userPreferencesAvailablity: responces[2],
            selectedUserId: idUser
        });
    });
});

router.get('/updateUserPriorityRequest', redirections.redirectLogin, (req, res) => {
    const {idUser, idPriority} = req.query;
    console.log("requst to change user priority");
    dbc.updateUserPriority(idUser, idPriority);
    res.writeHead(200, {'Content-Type': 'text/plain'});
    res.end('OK');
});

router.get('/loadTestAndRestartRequest', redirections.redirectLogin, (req, res) => {
    const {idTest} = req.query;
    console.log("requst to delete database and load test with id: " + idTest);
    // Promise.all([dbc.deleteAllData()]).then(responces => {
    //     timetableTests.loadTestEnviroment(idTest);
    // });
    // THIS WILL KILL APLICATION
    timetableTests.saveTestEnviromentAndKill(idTest);
    res.writeHead(200, {'Content-Type': 'text/plain'});
    res.end('OK');
});


// For Ajax communication
router.get('/updateRoomtypeRequest', redirections.redirectLogin, (req, res) => {
    console.log("requst to update roomtype");
    Roomtype.findAll({
        where: {
            idRoomtype: req.query.idRoomtype
        }
    }).then((roomtype) => {
        roomtype[0].name = req.query.name;
        roomtype[0].numOfRooms = req.query.numOfRooms;
        roomtype[0].save();
    });
    res.writeHead(200, {'Content-Type': 'text/plain'});
    res.end('OK');
});

// For Ajax communication
router.get('/updateRoomRequest', redirections.redirectLogin, (req, res) => {
    const {idRoom, idRoomtype, name} = req.query;
    console.log("requst to update room");
    Room.findAll({
        where: {
            idRoom: idRoom
        }
    }).then((room) => {
        room[0].name = name;
        room[0].idRoomtype = idRoomtype;
        room[0].save();
    });
    res.writeHead(200, {'Content-Type': 'text/plain'});
    res.end('OK');
});


// For Ajax communication
router.get('/updateCourseTimeslotRequst', redirections.redirectLogin, (req, res) => {
    console.log("requst to update roomtype");
    const idCourseTimeslot = req.query.idCourseTimeslot;
    const idTimeslot = req.query.idTimeslot;
    const idRoom = req.query.idRoom;
    CoursesTimeslots.findAll({
        where: {
            idCoursesTimeslot: idCourseTimeslot
        }
    }).then((coursetimeslot) => {
        coursetimeslot[0].idTimeslot = idTimeslot;
        coursetimeslot[0].idRoom = idRoom;
        coursetimeslot[0].save();
    });
    res.writeHead(200, {'Content-Type': 'text/plain'});
    res.end('OK');
});

router.get('/updateAvailabilitiesRequest', redirections.redirectLogin, (req, res) => {
    console.log("requst to update Availabilities");
    const arraytimeslotsIds = req.query.timeslotsIds;
    const arrayAvailValues = req.query.availabilitiesValues;
    for (i = 0; i < arraytimeslotsIds.length; i ++) {
        const findelement = UserPreferencesAvailibility.findAll({
            where: {
                idTimeslot: arraytimeslotsIds[i],
                idUser: req.query.idUser
            }
        });
        const promisedindex = new Promise(function (resolve) {
            resolve(i);
        });
        Promise.all([findelement, promisedindex]).then(responces => {
            responces[0][0].valueAvailability = arrayAvailValues[responces[1]];
            responces[0][0].save();
        });
    }
    res.writeHead(200, {'Content-Type': 'text/plain'});
    res.end('OK');
});


router.get('/updateRoomAvailsRequest', redirections.redirectLogin, (req, res) => {
    console.log("requst to update room Availabilities");
    const idRoomtype = req.query.idRoomtype;
    const arraytimeslotsIds = req.query.timeslotsIds;
    const arrayAvailValues = req.query.availabilitiesValues;
    for (i = 0; i < arraytimeslotsIds.length; i ++) {
        const findelement = RoomAvailability.findAll({
            where: {
                idTimeslot: arraytimeslotsIds[i],
                idRoomtype: idRoomtype
            }
        });
        const promisedindex = new Promise(function (resolve) {
            resolve(i);
        });
        Promise.all([findelement, promisedindex]).then(responces => {
            responces[0][0].numOfAvailRooms = arrayAvailValues[responces[1]];
            responces[0][0].save();
        });
    }
    res.writeHead(200, {'Content-Type': 'text/plain'});
    res.end('OK');
});


router.get('/updatePreferencesRequest', redirections.redirectLogin, (req, res) => {
    console.log("requst to update Preferences");
    const arraytimeslotsIds = req.query.timeslotsIds;
    const arrayPreferValues = req.query.preferencesValues;
    for (i = 0; i < arraytimeslotsIds.length; i ++) {
        const findelement = UserPreferencesAvailibility.findAll({
            where: {
                idTimeslot: arraytimeslotsIds[i],
                idUser: req.query.idUser
            }
        });
        const promisedindex = new Promise(function (resolve) {
            resolve(i);
        });
        Promise.all([findelement, promisedindex]).then(responces => {
            responces[0][0].valuePreference = arrayPreferValues[responces[1]];
            responces[0][0].save();
        });
    }
    res.writeHead(200, {'Content-Type': 'text/plain'});
    res.end('OK');
});

router.get('/updateCourseRequest', redirections.redirectLogin, (req, res) => {
    console.log("requst to update Course");
    Course.findAll({
        where: {
            idCourse: req.query.idCourse
        }
    }).then((course) => {
        course[0].idUser = req.query.idUser;
        course[0].idRoomtype = req.query.idRoomtype;
        course[0].idTimetable = req.query.idTimetable;
        course[0].save();
    });
    res.writeHead(200, {'Content-Type': 'text/plain'});
    res.end('OK');
});

router.get('/getTimetableForUser', redirections.redirectLogin, (req, res) => {
    console.log("requst to load timetable for user");
    const {idTimetable, idUser} = req.query;
    const getAllTimeslots = dbc.getAllTimeslotsWithIdTimetableIncludeAll(idTimetable)
    let getAllCoursesTimeslots;
    if (idUser == "all") {
        getAllCoursesTimeslots = CoursesTimeslots.findAll({
            where: {
                idTimetable: idTimetable
            },
            include: [
                {
                    model: Room
                }, {
                    model: Course
                }
            ]
        });
    } else {
        getAllCoursesTimeslots = CoursesTimeslots.findAll({
            where: {
                idTimetable: idTimetable,
                '$course.idUser$': idUser
            },
            include: [
                {
                    model: Room
                }, {
                    model: Course
                }
            ]
        });
    }
    Promise.all([getAllTimeslots, dbc.getTimetableWithId(idTimetable), getAllCoursesTimeslots]).then(responces => {
        res.render('./loads/timetableforuser', {
            user: sessionController.getLoggedUser(req),
            timeslots: responces[0],
            timetables: responces[1],
            arrtimeslotstext: timeManipulator.getTimeTexts(responces[1][0].timestart, responces[1][0].timepause, responces[1][0].timeslotduration, responces[1][0].numofslotsinaday),
            arrdays: timeManipulator.getDays(responces[1][0].days),
            numofslotsinaday: responces[1][0].numofslotsinaday,
            coursesTimeslots: responces[2]
        });
    });
});

router.get('/getCoursesTimeslots', redirections.redirectLogin, (req, res) => {
    const {idTimetable, idUser} = req.query;
    console.log("requst to load Courses Timeslots");
    let getAllCoursesTimeslots;
    if (idUser == "all") {
        getAllCoursesTimeslots = CoursesTimeslots.findAll({
            where: {
                idTimetable: idTimetable
            },
            include: [
                {
                    model: Course,
                    include: [
                        {
                            model: Roomtype
                        }, {
                            model: User
                        }

                    ]
                }, {
                    model: Room
                }
            ]
        });
    } else {
        getAllCoursesTimeslots = CoursesTimeslots.findAll({
            where: {
                idTimetable: idTimetable,
                '$course.idUser$': idUser
            },
            include: [
                {
                    model: Course,
                    include: [
                        {
                            model: Roomtype
                        }, {
                            model: User
                        }

                    ]
                }, {
                    model: Room
                }
            ]
        });
    }

    const getAllRooms = Room.findAll({
        include: [
            {
                all: true
            }
        ]
    });
    Promise.all([dbc.getAllTimeslotsWithIdTimetableIncludeAll(idTimetable), getAllCoursesTimeslots, getAllRooms]).then(responces => {
        res.render('./loads/coursestimeslotstable', {
            user: sessionController.getLoggedUser(req),
            timeslots: responces[0],
            coursestimeslots: responces[1],
            rooms: responces[2],
            idTimetable: idTimetable,
            idUser: idUser
        });
    });
});

router.get('/deleteRoomRequest', redirections.redirectLogin, (req, res) => {
    const {idRoom} = req.query;
    console.log("requst to delete Room");
    Room.destroy({
        where: {
            idRoom: idRoom
        }
    });
    res.writeHead(200, {'Content-Type': 'text/plain'});
    res.end('OK');
});

router.get('/deleteCourseRequest', redirections.redirectLogin, (req, res) => {
    const {idCourse} = req.query;
    console.log("requst to delete Course");
    Course.destroy({
        where: {
            idCourse: idCourse
        }
    });
    res.writeHead(200, {'Content-Type': 'text/plain'});
    res.end('OK');
});

router.get('/freeidCourseTimeslotRequest', redirections.redirectLogin, (req, res) => {
    const {idCoursesTimeslot} = req.query;
    console.log("requst to free idCourseTimeslot");
    CoursesTimeslots.findAll({
        where: {
            idCoursesTimeslot: idCoursesTimeslot
        }
    }).then(courseTimeslot => {
        courseTimeslot[0].idTimeslot = null;
        courseTimeslot[0].idRoom = null;
        courseTimeslot[0].save();
    });
    res.writeHead(200, {'Content-Type': 'text/plain'});
    res.end('OK');
});

router.get('/deleteRoomtypeRequest', redirections.redirectLogin, (req, res) => {
    console.log("requst to delete Roomtype");
    Roomtype.destroy({
        where: {
            idRoomtype: req.query.idRoomtype
        }
    });
    res.writeHead(200, {'Content-Type': 'text/plain'});
    res.end('OK');
});

// SOLVER FUNCTIONS
const loadToFileAndSolve = function (idTimetable) {
    solverParser.saveTimeslotsToFile(idTimetable);
    solverParser.saveCoursesToFile(idTimetable);
    solverParser.saveUserPreferencesAvailibilityToFile();
    solverParser.saveRoomAvailabilityToFile();
    setTimeout(delayedSolverRun, 4000);
    setTimeout(delayedLoadSolverSolution, 5000);
};

function delayedSolverRun() {
    solverParser.runSolver();
};

function delayedLoadSolverSolution() {
    solverParser.loadSolvedTimetableFromFile(1);
}

// SOLVER
router.get('/runSolverRequest', redirections.redirectLogin, (req, res) => {
    const {idTimetable} = req.query;
    console.log("requst to run solver with timetable index: " + idTimetable);
    loadToFileAndSolve(idTimetable);
    res.writeHead(200, {'Content-Type': 'text/plain'});
    res.end('OK');
});

router.get('/editcourses', redirections.redirectLogin, (req, res) => {
    const getAllcouses = Course.findAll({
        include: [
            {
                all: true
            }
        ]
    });
    Promise.all([getAllcouses, dbc.getAllUsers(), dbc.getAllRoomtypes(), dbc.getAllTimetables()]).then(responces => {
        res.render('./edits/editcourses', {
            user: sessionController.getLoggedUser(req),
            courses: responces[0],
            users: responces[1],
            roomtypes: responces[2],
            timetables: responces[3]
        });
    });
});

router.get('/editrooms', redirections.redirectLogin, (req, res) => {
    const getAllRooms = Room.findAll({
        include: [
            {
                all: true
            }
        ]
    });
    Promise.all([dbc.getAllRoomtypes(), getAllRooms]).then(responces => {
        res.render('./edits/editrooms', {
            user: sessionController.getLoggedUser(req),
            roomtypes: responces[0],
            rooms: responces[1]
        });
    });
});


router.get('/editroomtypes', redirections.redirectLogin, (req, res) => {
    const getAllRoomtypes = Roomtype.findAll({
        include: [
            {
                all: true
            }
        ]
    });
    Promise.all([getAllRoomtypes]).then(responces => {
        res.render('./edits/editroomtypes', {
            user: sessionController.getLoggedUser(req),
            roomtypes: responces[0]
        });
    });
});


// Not logged:

router.get('/login', redirections.redirectHome, (req, res) => res.render('login'));

router.post('/login', redirections.redirectHome, (req, res) => {
    const {name, password} = req.body;
    User.findAll({
        where: {
            name: name
        }
    }).then(user => {
        Promise.all([encryptController.comparePasswords(password, user[0].password)]).then(responces => {
            if (responces[0]) {
                sessionController.setLoggedUser(req, user[0]);
                res.redirect('/home');
            } else {
                res.redirect('/login');
            }
        })
    }).catch(err => {
        console.log(err);
        res.redirect('/login');
    });
});


router.get('/register', redirections.redirectHome, (req, res) => res.render('register'));

router.post('/register', redirections.redirectHome, (req, res) => {

    const {name, email, password} = req.body;
    if (name && password && email) {
        const hashedpasswordPromise = encryptController.hash(password);
        Promise.all([hashedpasswordPromise]).then(responces => {
            const hashedpassword = responces[0];
            User.create({name: name, password: hashedpassword, email: email}).then(user => {
                sessionController.setLoggedUser(req, user);
                return res.redirect('/home');
            }).catch(err => {
                console.log(err);
                res.redirect('/register');
            });
        });
    }
})


// Adds

// Add course
router.get('/addcourse', redirections.redirectLogin, (req, res) => {
    Promise.all([dbc.getAllUsers(), dbc.getAllRoomtypes(), dbc.getAllTimetables()]).then(responces => {
        res.render('./adds/addcourse', {
            user: sessionController.getLoggedUser(req),
            users: responces[0],
            roomtypes: responces[1],
            timetables: responces[2]
        });
    });
});

router.post('/addcourse', redirections.redirectLogin, (req, res) => {
    const {name, idUser, idRoomtype, idTimetable} = req.body;
    dbc.createCourse(name, idUser, idRoomtype, idTimetable).then((result) => {
        if (result) { // Print success
            res.render('message', {
                user: sessionController.getLoggedUser(req),
                message: "Course " + name + " has been succesfully added." + "<br> <a href='/addcourse'>Add another Course</a>"
            });
        } else { // Print failure
            res.render('message', {
                user: sessionController.getLoggedUser(req),
                message: "Course " + name + " has NOT been succesfully added! Please select and fill in all data." + "<br> <a href='/addcourse'>Add another Course</a>"
            });
        }
    });
})


// Add Room
router.get('/addroom', redirections.redirectLogin, (req, res) => {
    Promise.all([dbc.getAllRoomtypes()]).then(responces => {
        res.render('./adds/addroom', {
            user: sessionController.getLoggedUser(req),
            roomtypes: responces[0]
        });
    });
});

router.post('/addroom', redirections.redirectLogin, (req, res) => {
    const {name, idRoomtype} = req.body;
    dbc.createRoom(name, idRoomtype).then((result) => {
        if (result) { // Print success
            res.render('message', {
                user: sessionController.getLoggedUser(req),
                message: "Room " + name + " has been succesfully added." + "<br> <a href='/addroom'>Add another Room</a>"
            });
        } else { // Print failure
            res.render('message', {
                user: sessionController.getLoggedUser(req),
                message: "Room " + name + " has NOT been succesfully added! Please select and fill in all data." + "<br> <a href='/addroom'>Add another Room</a>"
            });
        }
    });
})


// Add Roomtype
router.get('/addroomtype', redirections.redirectLogin, (req, res) => {
    res.render('./adds/addroomtype', {user: sessionController.getLoggedUser(req)});
});

router.post('/addroomtype', redirections.redirectLogin, (req, res) => {
    const {name} = req.body;
    dbc.createRoomType(name).then((result) => {
        if (result) { // Print success
            res.render('message', {
                user: sessionController.getLoggedUser(req),
                message: "Room type" + name + " has been succesfully added." + "<br> <a href='/addroomtype'>Add another Room type</a>"
            });
        } else { // Print failure
            res.render('message', {
                user: sessionController.getLoggedUser(req),
                message: "Room type" + name + " has NOT been succesfully added! Please select and fill in all data correctly." + "<br> <a href='/addroomtype'>Add another Room type</a>"
            });
        }
    });
});


// Add Timetable
router.get('/addtimetable', redirections.redirectLogin, (req, res) => {
    res.render('./adds/addtimetable', {user: sessionController.getLoggedUser(req)});
});

router.post('/addtimetable', redirections.redirectLogin, (req, res) => {
    const {
        name,
        days,
        timestart,
        timepause,
        timeslotduration,
        numofslotsinaday
    } = req.body;
    dbc.createTimetable(name, days, timestart, timepause, timeslotduration, numofslotsinaday).then((result) => {
        if (result) { // Print success
            res.render('message', {
                user: sessionController.getLoggedUser(req),
                message: "Timetable " + name + " has been succesfully added." + "<br> <a href='/addtimetable'>Add another Timetable</a>"
            });
        } else { // Print failure
            res.render('message', {
                user: sessionController.getLoggedUser(req),
                message: "Timetable " + name + " has NOT been succesfully added! Please select and fill in all data correctly, look at examples." + "<br> <a href='/addtimetable'>Add another Timetable</a>"
            });
        }
    });
});

router.get('/about', (req, res) => res.render('about', {user: sessionController.getLoggedUser(req)}));

router.get('/logout', redirections.redirectLogin, (req, res) => {
    const sessionID = req.session.id;
    req.session.destroy(err => {
        if (err) {
            console.log("Session error");
            return res.redirect('/');
        };
        res.clearCookie(sessionID);
        res.render('message', {message: "You have been logged out."});
    });
});

module.exports = router;
