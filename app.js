// npm extensions
const express = require('express');
const session = require('express-session');
const path = require('path');
const GracefulShutdownManager = require('@moebius/http-graceful-shutdown').GracefulShutdownManager;

// routes
const adminRoutes = require('./routes/admin.js');

// controllers
const errorsController = require('./controllers/errorsController.js');

// models
const Priority = require('./models/priority.js');
const User = require('./models/user.js');
const Relations = require('./models/relations.js');

const sequelize = require('./controllers/database');

// scripts
const solverParser = require('./scripts/solver_parser.js');
const timetableTests = require('./scripts/timetable_tests.js');

// server setup
const app = express();
app.set('view engine', 'ejs');
app.set('views', 'views');

// development values
const port = 3000;
const cookieMaxAge = 60 * 60 * 1000 * 2;

// request-body-parser
app.use(express.urlencoded({extended: true}));

// settings for global public directory (public js and css files)
app.use(express.static(path.join(__dirname, 'public')));

// ression definition
app.use(session({
    saveUninitialized: false, // if cookie was not edited in any way (user did not logged in) this setting will not keep that users session in memory
    resave: false,
    secret: 'long long string of some text', // in production should be randomised
    cookie: {
        maxAge: cookieMaxAge,
        sameSite: true, // cookie will be accepted only from the same site
        secure: false // true //forces using HTTPS for cookies, HTTP will still work but not cookies, will be set to true in production
    }
}));

// sets adminRoutes middleware to handle all GET and POST requests
app.use(adminRoutes);

// sets get404 middleware to catch all requests to non existing pages
app.use(errorsController.get404);

// if not created, creates database model
// force true - forces old tables to be dropped and new ones to be created according to the "newly" set models
sequelize.sync( {force: true }
 ).then(result => {  
    timetableTests.loadTestEnviroment();
    const server = app.listen(port);
    const shutdownManager = new GracefulShutdownManager(server);
    process.on('SIGTERM', () => {
        shutdownManager.terminate(() => {
          console.log('Server is gracefully terminated');
        });
      });
 }).catch(error => {
    console.log(error);
 });