const bcrypt = require('bcrypt');

function ValidateLogin(name) {
    const re = /^[a-zA-Z0-9]([._-](?![._-])|[a-zA-Z0-9]){3,18}[a-zA-Z0-9]$/;
    return re.test(name);
}

function ValidateEmail(email) {
    const re = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return re.test(email);
}

function ValidatePassword(password) {
    const re = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[a-zA-Z]).{8,}$/;
    return re.test(password);
}

async function GenerateHash(password){
    let saltRounds = 10;
    //bcrypt.hash(password, saltRounds, function(err, hash){
    //    console.log("salted pass", hash);
    //    return hash;
    //});
    return hash = await bcrypt.hash(password, saltRounds);
}
exports.ValidateLogin = ValidateLogin;
exports.ValidateEmail = ValidateEmail;
exports.ValidatePassword = ValidatePassword;
exports.GenerateHash = GenerateHash;
