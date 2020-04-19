// sends request to update roomtypes name
function updateRoomtype(idRoomtype, els) {
    const name = els.children[0].children[0].value;
    var xhttp = new XMLHttpRequest();
    xhttp.open("GET", "/updateRoomtypeRequest?idRoomtype=" + idRoomtype + "&name=" + name, true);
    xhttp.send();
    alert('Send Update Roomtype request to server ');
    location.reload();
}

// sends request to delete roomtype with given id
function deleteRoomtype(idRoomtype) {
    var xhttp = new XMLHttpRequest();
    xhttp.open("GET", "/deleteRoomtypeRequest?idRoomtype=" + idRoomtype, true);
    xhttp.send();
    alert('Send delete Roomtype request to server.');
    location.reload();
}

// sends request to updata data in course with given idUser, idRoomtype, idTimetable
function updateCourse(idCourse, els) {
    const idUser = els.children[4].children[0].options[els.children[4].children[0].selectedIndex].getAttribute('idUser');
    const idRoomtype = els.children[5].children[0].options[els.children[5].children[0].selectedIndex].getAttribute('idRoomtype');
    const idTimetable = els.children[6].children[0].options[els.children[6].children[0].selectedIndex].getAttribute('idTimetable');
    var xhttp = new XMLHttpRequest();
    xhttp.open("GET", "/updateCourseRequest?idCourse=" + idCourse + "&idUser=" + idUser + "&idRoomtype=" + idRoomtype + "&idTimetable=" + idTimetable, true);
    xhttp.send();
    alert('Send Update Course request to server ');
    location.reload();
}

// sends request to update CoureTimeslots with given idTimeslot, idRoom
function updateCourseTimeslot(idCourseTimeslot, tr) {
    const selectTimeslot = tr.children[4].children[0]
    const idTimeslot = selectTimeslot.options[selectTimeslot.selectedIndex].getAttribute('id');
    const selectRoom = tr.children[5].children[0]
    const idRoom = selectRoom.options[selectRoom.selectedIndex].getAttribute('id');
    const idTimetable = tr.getAttribute('idTimetable');
    const idUser = tr.getAttribute('idUser');
    var xhttp = new XMLHttpRequest();
    if(idRoom==null || idTimeslot==null){
        alert('Please select both New Timeslot and New Room.');
        return;
    }
    xhttp.open("GET", "/updateCourseTimeslotRequst?idCourseTimeslot=" + idCourseTimeslot + "&idTimeslot=" + idTimeslot + "&idRoom=" + idRoom, true);
    xhttp.send();
    alert('Send Update Course Timeslot request to server ');
    // Reload table
    updateTimetableById(idUser, idTimetable);
}

// sends request to update user availabilities for given timetable
function updateAvailablities(table) {
    const idUser = table.children[0].children[0].getAttribute('selectedUserId');
    const days = table.children[0].children;
    const timeslotsIds = new Array();
    const availabilitiesValues = new Array();
    let counter = 0;
    for (i = 1; i < days.length; i ++) {
        const innerTds = days[i].children;
        for (y = 1; y < innerTds.length; y ++) {
            const innerselect = innerTds[y].children[0];
            timeslotsIds[counter] = innerselect.getAttribute('id');
            availabilitiesValues[counter] = innerselect.options[innerselect.selectedIndex].value;
            counter++;
        }
    }
    var xhttp = new XMLHttpRequest();
    let getrequeststring = "/updateAvailabilitiesRequest?idUser=" + idUser;
    timeslotsIds.forEach((val) => {
        getrequeststring = getrequeststring + "&timeslotsIds=" + val;
    });
    availabilitiesValues.forEach((val) => {
        getrequeststring = getrequeststring + "&availabilitiesValues=" + val;
    });
    xhttp.open("GET", getrequeststring, true);
    xhttp.send();
    alert('Send Availablities update request to server ');
    // location.reload();
}

// sends request to update user preferences for givet timetable
function updatePreferences(table) {
    const idUser = table.children[0].children[0].getAttribute('selectedUserId');
    const days = table.children[0].children;
    const timeslotsIds = new Array();
    const availabilitiesValues = new Array();
    let counter = 0;
    for (i = 1; i < days.length; i ++) {
        const innerTds = days[i].children;
        for (y = 1; y < innerTds.length; y ++) {
            const innerselect = innerTds[y].children[0];
            timeslotsIds[counter] = innerselect.getAttribute('id');
            availabilitiesValues[counter] = innerselect.options[innerselect.selectedIndex].value;
            counter++;
        }
    }
    var xhttp = new XMLHttpRequest();
    let getrequeststring = "/updatePreferencesRequest?idUser=" + idUser;
    timeslotsIds.forEach((val) => {
        getrequeststring = getrequeststring + "&timeslotsIds=" + val;
    });
    availabilitiesValues.forEach((val) => {
        getrequeststring = getrequeststring + "&preferencesValues=" + val;
    });
    xhttp.open("GET", getrequeststring, true);
    xhttp.send();
    alert('Send Preferences update request to server ');
    // location.reload();
}

// sends request to load timetable for given iduser and idtimetable
function updateTimetableById(idUser, idTimetable) {
    var xhttp = new XMLHttpRequest();
    xhttp.open("GET", "/getTimetableForUser?idUser=" + idUser + "&idTimetable=" + idTimetable, true);
    xhttp.send();
    xhttp.onreadystatechange = function () {
        if (this.readyState == 4 && this.status == 200) {
            document.getElementById("table1").innerHTML = xhttp.responseText;
        }
    };
    updateCoursesTimeslots(idUser, idTimetable);
}

// sends request to load timetable for selected user and selected timetable
function updateTimetable(userSelect, timetableSelect) {
    const idUser = userSelect.options[userSelect.selectedIndex].getAttribute('idUser');
    const idTimetable = timetableSelect.options[timetableSelect.selectedIndex].getAttribute('idTimetable');
    if (idUser == null || idTimetable == null) {return;}
    var xhttp = new XMLHttpRequest();
    xhttp.open("GET", "/getTimetableForUser?idUser=" + idUser + "&idTimetable=" + idTimetable, true);
    xhttp.send();
    xhttp.onreadystatechange = function () {
        if (this.readyState == 4 && this.status == 200) {
            document.getElementById("table1").innerHTML = xhttp.responseText;
        }
    };
    updateCoursesTimeslots(idUser, idTimetable);
}

// sends request to update courses timeslots for given idUser and idtimetable
function updateCoursesTimeslots(idUser, idTimetable) {
    var xhttp = new XMLHttpRequest();
    xhttp.open("GET", "/getCoursesTimeslots?idTimetable=" + idTimetable + "&idUser=" + idUser, true);
    xhttp.send();
    xhttp.onreadystatechange = function () {
        if (this.readyState == 4 && this.status == 200) {
            document.getElementById("table2").innerHTML = xhttp.responseText;
        }
    };
}

// sends request to load user preferences table for selected user and selected timetable
function updatePreferencestable(timetableSelect, userSelect) {
    const idTimetable = timetableSelect.options[timetableSelect.selectedIndex].getAttribute('id');
    const idUser = userSelect.options[userSelect.selectedIndex].getAttribute('idUser');
    var xhttp = new XMLHttpRequest();
    xhttp.open("GET", "/getPreferencestableForUser?idUser=" + idUser + "&idTimetable=" + idTimetable, true);
    xhttp.send();
    xhttp.onreadystatechange = function () {
        if (this.readyState == 4 && this.status == 200) {
            document.getElementById("table1").innerHTML = xhttp.responseText;
        }
    };
}

// sends request to load user availabilities table for selected user and selected timetable
function updateAvailabilitiestable(timetableSelect, userSelect) {
    const idTimetable = timetableSelect.options[timetableSelect.selectedIndex].getAttribute('idTimetable');
    const idUser = userSelect.options[userSelect.selectedIndex].getAttribute('idUser');
    var xhttp = new XMLHttpRequest();
    xhttp.open("GET", "/getAvailabilitiestableForUser?idUser=" + idUser + "&idTimetable=" + idTimetable, true);
    xhttp.send();
    xhttp.onreadystatechange = function () {
        if (this.readyState == 4 && this.status == 200) {
            document.getElementById("table1").innerHTML = xhttp.responseText;
        }
    };
}

// sends request to load roomtype availabilities table for selected timetable and selected roomtype
function updateRoomAvailabilitiestable(timetableSelect, roomtypeSelect) {
    const idTimetable = timetableSelect.options[timetableSelect.selectedIndex].getAttribute('id');
    const idRoomtype = roomtypeSelect.options[roomtypeSelect.selectedIndex].getAttribute('id');
    var xhttp = new XMLHttpRequest();
    xhttp.open("GET", "/getRoomAvailabilitiestable?idTimetable=" + idTimetable + "&idRoomtype=" + idRoomtype, true);
    xhttp.send();
    xhttp.onreadystatechange = function () {
        if (this.readyState == 4 && this.status == 200) {
            document.getElementById("table1").innerHTML = xhttp.responseText;
        }
    };
}

// sends request to update roomtype availabilities with given table
function updateRoomAvailablities(table) {
    const idRoomtype = table.children[0].children[0].getAttribute("idRoomtype");
    const days = table.children[0].children;
    const timeslotsIds = new Array();
    const availabilitiesValues = new Array();
    let counter = 0;
    for (i = 1; i < days.length; i ++) {
        const innerTds = days[i].children;
        for (y = 1; y < innerTds.length; y ++) {
            const innerinput = innerTds[y].children[0];
            timeslotsIds[counter] = innerinput.getAttribute('id');
            availabilitiesValues[counter] = innerinput.value;
            counter++;
        }
    }
    var xhttp = new XMLHttpRequest();
    let getrequeststring = "/updateRoomAvailsRequest?idRoomtype=" + idRoomtype;
    timeslotsIds.forEach((val) => {
        getrequeststring = getrequeststring + "&timeslotsIds=" + val;
    });
    availabilitiesValues.forEach((val) => {
        getrequeststring = getrequeststring + "&availabilitiesValues=" + val;
    });
    xhttp.open("GET", getrequeststring, true);
    xhttp.send();
    alert('Send Room Availibilities update request to server ');
    // location.reload();
}

// sends request to update room with given name and selected roomtype
function updateRoom(idRoom, tr) {
    const name = tr.children[0].children[0].value;
    const selectRoomtype = tr.children[2].children[0];
    const idRoomtype = selectRoomtype.options[selectRoomtype.selectedIndex].getAttribute("idRoomtype");
    var xhttp = new XMLHttpRequest();
    let getrequeststring = "/updateRoomRequest?idRoom=" + idRoom + "&name=" + name + "&idRoomtype=" + idRoomtype;
    xhttp.open("GET", getrequeststring, true);
    xhttp.send();
    alert('Send Room update request to server ');
    location.reload();
}

// sends request to delete room with given idRoom
function deleteRoom(idRoom) {
    var xhttp = new XMLHttpRequest();
    let getrequeststring = "/deleteRoomRequest?idRoom=" + idRoom;
    xhttp.open("GET", getrequeststring, true);
    xhttp.send();
    alert('Send Room delete request to server ');
    location.reload();
}

// sends request to delete Course with given idCourse
function deleteCourse(idCourse) {
    var xhttp = new XMLHttpRequest();
    let getrequeststring = "/deleteCourseRequest?idCourse=" + idCourse;
    xhttp.open("GET", getrequeststring, true);
    xhttp.send();
    alert('Send Course delete request to server.');
    location.reload();
}

// sends request to free CourseTimeslot with given idCourseTimeslot
function freeCourseTimeslot(idCoursesTimeslot, tr) {
    var xhttp = new XMLHttpRequest();
    let getrequeststring = "/freeidCourseTimeslotRequest?idCoursesTimeslot=" + idCoursesTimeslot;
    xhttp.open("GET", getrequeststring, true);
    xhttp.send();
    const idTimetable = tr.getAttribute('idTimetable');
    const idUser = tr.getAttribute('idUser');
    alert('Send Free timetable slot request to server ');
    updateTimetableById(idUser, idTimetable);
}

// sends request to start solver with given idTimetable
function runSolver(timetableSelect) {
    const idTimetable = timetableSelect.options[timetableSelect.selectedIndex].getAttribute("idTimetable");
    var xhttp = new XMLHttpRequest();
    let getrequeststring = "/runSolverRequest?idTimetable=" + idTimetable;
    xhttp.open("GET", getrequeststring, true);
    xhttp.send();
    alert('Send run Solver request to server, please allow several second to finish.');
    // location.reload();
}

// sends request to lod test and restart server
function loadTestAndRestart(testSelect) {
    const idTest = testSelect.options[testSelect.selectedIndex].getAttribute("idTest");
    var xhttp = new XMLHttpRequest();
    let getrequeststring = "/loadTestAndRestartRequest?idTest=" + idTest;
    const allowed = confirm("Are you sure? This will detele ALL data and load new test.");
    if (allowed) {
        xhttp.open("GET", getrequeststring, true);
        xhttp.send();
        alert('Please login again, you will be redirected');
        location.reload();
    }
}
