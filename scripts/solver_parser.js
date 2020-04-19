// npm extensions
const fs = require('fs');
const readline = require('readline');
const {spawn} = require('child_process');

// models
const Course = require('../models/course.js');
const UserPreferencesAvailibility = require('../models/user_preferences_availability.js');
const RoomAvailability = require('../models/room_availability.js');
const Timeslot = require('../models/timeslot.js');
const CoursesTimeslots = require('../models/courses_timeslots.js');

// saves data about Courses for solver to courses.txt file
exports.saveCoursesToFile = (idTimetable) => {
    Promise.resolve(Course.findAll({
        where: {
            idTimetable: idTimetable
        }
    })).then((courses) => {
        const stream = fs.createWriteStream("courses.txt");
        stream.once('open', function (fd) {
            courses.forEach(course => {
                stream.write(course.idCourse.toString() + " " + course.idUser.toString() + " " + course.idRoomtype.toString() + "\n");
            });
            stream.end();
        });
    });
};

// saves data about all users preferences for solver to user_preferences_availability.txt file
exports.saveUserPreferencesAvailibilityToFile = () => {
    Promise.resolve(UserPreferencesAvailibility.findAll()).then((userPrefAndAvail) => {
        const stream = fs.createWriteStream("user_preferences_availability.txt");
        stream.once('open', function (fd) {
            userPrefAndAvail.forEach(userPrefAndAvail => {
                stream.write(userPrefAndAvail.idUser.toString() + " " + userPrefAndAvail.idTimeslot.toString() + " " + userPrefAndAvail.valuePreference.toString() + " " + userPrefAndAvail.valueAvailability.toString() + "\n");
            });
            stream.end();
        });
    });
};

// saves data about all room's availabilities for solver to room_availibility.txt file
exports.saveRoomAvailabilityToFile = () => {
    Promise.resolve(RoomAvailability.findAll()).then((roomsAvail) => {
        const stream = fs.createWriteStream("room_availibility.txt");
        stream.once('open', function (fd) {
            roomsAvail.forEach(roomAvail => {
                stream.write(roomAvail.idTimeslot.toString() + " " + roomAvail.idRoomtype.toString() + " " + roomAvail.numOfAvailRooms.toString() + "\n");
            });
            stream.end();
        });
    });
};

// saves data about all timeslots for solver to timeslots.txt file
exports.saveTimeslotsToFile = (idTimetable) => {
    Promise.resolve(Timeslot.findAll({
        where: {
            idTimetable: idTimetable
        }
    })).then((timeslots) => {
        const stream = fs.createWriteStream("timeslots.txt");
        stream.once('open', function (fd) {
            timeslots.forEach(timeslot => {
                stream.write(timeslot.idTimeslot.toString() + "\n");
            });
            stream.end();
        });
    });
};

// loads solved timetabling problem from solver to database
exports.loadSolvedTimetableFromFile = (idTimetable) => {
    processLineByLine(idTimetable);
};

// Code used here (for readling from file) is taken from nodejs API docs: https://nodejs.org/api/readline.html#readline_example_read_file_stream_line_by_line
function processLineByLine(idTimetable) {
    const rl = readline.createInterface({input: fs.createReadStream('timetabling.sol'), crlfDelay: Infinity});

    rl.on('line', (line) => {
        if (line.startsWith("x")) {
            const arr = line.split(" ");
            // 1 says that course has been assigned to timeslot
            if (arr[1] == 1) {
                const foundidcourse = arr[0].slice(arr[0].indexOf("[") + 1, arr[0].indexOf("]")).split(",")[0];
                const foundidTimeslot = arr[0].slice(arr[0].indexOf("[") + 1, arr[0].indexOf("]")).split(",")[1];
                console.log(foundidcourse + " " + foundidTimeslot);
                // loads data to dabatase
                CoursesTimeslots.findAll({ where: { idCourse: foundidcourse } }).then((courseTimeslot) => {
                    if (typeof courseTimeslot[0] == 'undefined') {
                        CoursesTimeslots.create({ idCourse: foundidcourse, idTimeslot: foundidTimeslot, idTimetable: idTimetable });
                    }
                    else {
                        courseTimeslot[0].idTimeslot = foundidTimeslot;
                        courseTimeslot[0].save();
                    }
                });
            }
        }
    });
}

// starts solving saved data
// Code used here is taken from nodejs API docs: "https://nodejs.org/api/child_process.html#child_process_spawning_bat_and_cmd_files_on_windows"
exports.runSolver = () => { // On Windows Only
    const bat = spawn('cmd.exe', ['/c', 'run.bat']);

    bat.stdout.on('data', (data) => {
        console.log(data.toString());
    });

    bat.stderr.on('data', (data) => {
        console.log(data.toString());
    });

    bat.on('exit', (code) => {
        console.log(`Child exited with code ${code}`);
    });

};
