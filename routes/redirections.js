//controllers
const sessionController = require('../controllers/sessionController.js');

//redirects not logged user to login page
exports.redirectLogin = (req, res, next) => {
    if (!sessionController.isLogged(req)) {
        res.redirect('/login');
    }
    else {
        next();
    }
};

//redirects logged user to home page
exports.redirectHome = (req, res, next) => {
    if (sessionController.isLogged(req)) {
        res.redirect('/home');
    }
    else {
        next();
    }
};