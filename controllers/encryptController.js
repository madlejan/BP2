// for password hashing
var bcrypt = require('bcrypt');
const saltRounds = 8; // ~40 hashes/sec

//returns promise of hashed password
exports.hash = (password) => { 
    // auto generate salt + hashed password
    return bcrypt.hash(password, saltRounds);
};

//returns promise of comparison (true if passwords are same, false otherwise)
exports.comparePasswords = (password, hash) => { 
    // auto generate salt + hashed password
    return bcrypt.compare(password, hash);
};
