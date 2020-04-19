const fs = require('fs');
const readline = require('readline');

// scripts
const encryptController = require('../controllers/encryptController')

const User = require('../models/user');
const Priority = require('../models/priority');
const Course = require('../models/course');
const Roomtype = require('../models/roomtype');
const Timeslot = require('../models/timeslot');
const Timetable = require('../models/timetable');
const UserPreferencesAvailibility = require('../models/user_preferences_availability');
const RoomAvailability = require('../models/room_availability');
const Room = require('../models/room');


// create test Timetable1
exports.populateDBwithSimpleTimetableProblem1 = () => {
    Priority.create({name: "admin"});
    const timetable = Timetable.create({
        name: "Simple Timetable",
        timestart: "08:00",
        timepause: 10,
        timeslotduration: 60,
        days: "110000",
        numofslotsinaday: 2
    });

    // why delay functions? because there are triggers/hooks that create appropriate new elements in database,
    // but when created synchronously, they sometimes don't appear at all or are sometimes doubled (even with promises),
    // I presume it's bug in Sequelize.
    setTimeout(delayedFunction0, 500);
    setTimeout(delayedFunction1, 1000);
    setTimeout(delayedFunction2, 2000);
    setTimeout(delayedFunction3, 3000);
    setTimeout(delayedFunction4, 4000);
}

function delayedFunction0() 
{
    const roomtype1 = Roomtype.create({name: "testroomtype1"});
    const roomtype2 = Roomtype.create({name: "testroomtype2"});
}

function delayedFunction1() 
{
    Promise.all([
        encryptController.hash("admin"),
        encryptController.hash("heslo2"),
    ]).then(responces => {
        const hashedpassword1 = responces[0];
        const hashedpassword2 = responces[1];
        const user1 = User.create({name: "admin", password: hashedpassword1, email: "admin@admin.cz", idPriority: 1});
        const user2 = User.create({name: "testuser2", password: hashedpassword2, email: "testuser2@testuser2.com", idPriority: 1});
        Promise.all([user1, user2]).then(responces2 => {
            Course.create({name: "course1", idUser: 1, idRoomtype: 1, idTimetable: 1})
            Course.create({name: "course2", idUser: 2, idRoomtype: 1, idTimetable: 1})
        });
    });

}

function delayedFunction2() {
    Room.create({name: "room1", idRoomtype: 1});
}
function delayedFunction3() {
    Room.create({name: "room2", idRoomtype: 1});
}

function delayedFunction4() {
    Promise.all([
        RoomAvailability.findAll(
            {
            }
        )
    ]).then(responces => {
        responces[0].forEach(element => {
            element.numOfAvailRooms = 0;
            element.save();
        });
    });
    Promise.all([
        RoomAvailability.findAll(
            {
                where: {idTimeslot: 1,
                        idRoomtype: 1}
            }
        )
    ]).then(responces => {
        responces[0][0].numOfAvailRooms = 1;
        responces[0][0].save();
    });
    Promise.all([
        RoomAvailability.findAll(
            {
                where: {idTimeslot: 2,
                    idRoomtype: 1}
            }
        )
    ]).then(responces => {
        responces[0][0].numOfAvailRooms = 1;
        responces[0][0].save();
    });
    UserPreferencesAvailibility.findAll({where: {idUser: 1, idTimeslot: 1}}).then(prefAvail =>{
        prefAvail[0].valuePreference = 0;
        prefAvail[0].valueAvailability = 1;
        prefAvail[0].save();
    });
    UserPreferencesAvailibility.findAll({where: {idUser: 1, idTimeslot: 2}}).then(prefAvail =>{
        prefAvail[0].valuePreference = 1;
        prefAvail[0].valueAvailability = 1;
        prefAvail[0].save();
    });
    UserPreferencesAvailibility.findAll({where: {idUser: 2, idTimeslot: 1}}).then(prefAvail =>{
        prefAvail[0].valuePreference = 1;
        prefAvail[0].valueAvailability = 1;
        prefAvail[0].save();
    });
    UserPreferencesAvailibility.findAll({where: {idUser: 2, idTimeslot: 2}}).then(prefAvail =>{
        prefAvail[0].valuePreference = 0;
        prefAvail[0].valueAvailability = 1;
        prefAvail[0].save();
    });
}


exports.saveTestEnviromentAndKill = (idTest) => {
    const stream = fs.createWriteStream("test.txt");
    stream.once('open', function (fd) {
        stream.write(idTest.toString());
        stream.end();
        process.exit(0);
    });

};


exports.loadTestEnviroment = (idTest) => {
    const rl = readline.createInterface({input: fs.createReadStream('test.txt'), crlfDelay: Infinity});
    rl.on('line', (line) => {
        if (idTest != null) {
            line = idTest;
        }
        switch (line) {
            case '1':
                this.populateDBwithSimpleTimetableProblem1();
                break;
            case '2':
                this.populateDBwithSimpleTimetableProblem2();
                break;
            case '3':
                this.populateDBwithSimpleTimetableProblem3();
                break;
            default:
                break;
        }
    });
}
