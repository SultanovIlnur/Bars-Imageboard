const bcrypt = require('bcrypt');

function ValidateLogin(name) {
    const re = /^[a-zA-Z0-9]([._-](?![._-])|[a-zA-Z0-9]){3,18}[a-zA-Z0-9]$/;
    return re.test(name);
}
function ValidateEmail(email) {
    const re = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return re.test(email);
}

function GenerateHash(password){
    let saltRounds = 10;
    bcrypt.genSalt(saltRounds, function(err, salt) {
        bcrypt.hash(password, salt, function(err, hash) {
            return hash;
        });
      });
}
exports.GenerateHash = GenerateHash;
exports.ValidateLogin = ValidateLogin;
exports.ValidateEmail = ValidateEmail;
