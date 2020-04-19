const moment = require('moment');

const Timeslot = require('../models/timeslot.js')

// important! doesn't check for right formatting, that is checked before adding to the database (at creating timetable obj.)
exports.createTimeslots = (timetable) => {
    const numofslotsinaday = timetable.numofslotsinaday;
    const days = timetable.days;
    const idtimetable = timetable.idTimetable;
    let arrdays = this.getDays(days);
    // create timeslots
    // indexes of orders in timeslots
    for (let i = 0; i < arrdays.length; i++) {
        for (let x = 0; x < numofslotsinaday; x++) {
            Timeslot.create({
                name: (arrdays[i] + x),
                order: (x + i * numofslotsinaday),
                idTimetable: idtimetable
            });
        }
    }
};

//returns array with strings of days
exports.getDays = (days) => {
    let arrdays = new Array();

    // add proper days
    for (let i = 0; i < 7; i++) {
        if (days.charAt(i) == 1) {
            switch (i) {
                case 0:
                    // mo
                    arrdays.push("Monday");
                    break;
                case 1:
                    // tu
                    arrdays.push("Tuesday");
                    break;
                case 2:
                    // we 
                    arrdays.push("Wednesday");
                    break;
                case 3:
                    // th
                    arrdays.push("Thursday");
                    break;
                case 4:
                    // fr
                    arrdays.push("Friday");
                    break;
                case 5:
                    // sa
                    arrdays.push("Saturday");
                    break;
                case 6:
                    // su
                    arrdays.push("Sunday");
                    break;
            }
        }
    }
    return arrdays;
}

//returns array with texts for table reprezentatiton of timetable, example: "08:00 - 9:00"
exports.getTimeTexts = (timestart, timepause, timeslotduration, numofslotsinaday) => {
    let arrtimeslotstext = new Array(numofslotsinaday);
    let curtime = moment(timestart, "HH:mm");

    for (let i = 0; i < numofslotsinaday; i++) {
        arrtimeslotstext[i] = getProperTimeString(curtime.hours()) + ':' + getProperTimeString(curtime.minutes()) + " - ";
        curtime.add(timeslotduration, 'm');
        arrtimeslotstext[i] = arrtimeslotstext[i] + getProperTimeString(curtime.hours()) + ':' + getProperTimeString(curtime.minutes());
        curtime.add(timepause, 'm');
    }

    return arrtimeslotstext;
}

//adds zero to numbers that are lower then 10 to corretly format time
const getProperTimeString = (time) =>{if (parseInt(time)<10) {
    return '0'+time;
}
else{
    return time;
}}