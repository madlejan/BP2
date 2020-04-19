// script that controls data validity and manipulation with them

//everything should have some value, not be null or undefined
// false = data are wrong, true - they are ok
exports.checkNullOrEmpty = (...values) => {
    return !(values.some((val) => (val == null || val == undefined || val == "" || typeof val == "undefined")))
}

//checks if is number
exports.checkIsNumber = (num) => {
    var reg = /^\d+$/;
    return (reg.test(num))
}

// checks correctness of input data (used when creating timetable)
exports.checkTableInputs = (timestart, timepause, timeslotduration, numofslotsinaday) => {
    if(timestart.length!=5){
        return false;
    }
    const reex = /(2[0-3]|[01][0-9]):[0-5][0-9]/;
    if(!reex.test(timestart)){
        return false;
    }

    if(!this.checkIsNumber(timepause)){
        return false;
    }
    if(parseInt(timepause)>1440){
        return false;
    }
    if(!this.checkIsNumber(timeslotduration)){
        return false;
    }
    if(parseInt(timeslotduration)>1440){
        return false;
    }
    if(!this.checkIsNumber(numofslotsinaday)){
        return false;
    }
    return true;
}

// returns 1 if given day is in given array, 0 otherwise (for Timetable data creation)
getHasDay = (arr, input) => {
    if (arr.some((day) => day == input)) {
        return "1";
    } else {
        return "0";
    }
}

// returns created string of 7 numbers (1 if day is located in array, 0 if not) example: all days but monday return this string "0111111"
exports.createDayString = (days) => {
    return getHasDay(days, "MO") + getHasDay(days, "TU") + getHasDay(days, "WE") + getHasDay(days, "TH") + getHasDay(days, "FR") + getHasDay(days, "SA") + getHasDay(days, "SU");
}