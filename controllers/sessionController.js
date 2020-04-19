// returns boolean whether user is logged 
exports.isLogged = (req) => (typeof req.session.user  != 'undefined') ? true : false;

// returns user object saved in session
exports.getLoggedUser = (req) => req.session.user;

// sets user object to session
exports.setLoggedUser = (req, user) => req.session.user = user;