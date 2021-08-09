const express = require("express");
const app = express();
const hbs = require("hbs");
const jsonParser = express.json();
const MongoClient = require("mongodb").MongoClient;
const url = "mongodb://localhost:27017/";
const mongoClient = new MongoClient(url, {useUnifiedTopology: true});
const session = require('express-session');
const passport = require('passport');
const LocalStrategy  = require('passport-local').Strategy;
const bodyParser = require("body-parser");

const auth = require("./auth.js");

var siteName = "Imageboard";
var usersDB;

app.use(express.static("public"));
app.use(session({ secret: "agaglaglag;" }));
app.use(bodyParser.urlencoded({ extended: false }));
app.use(passport.initialize());
app.use(passport.session());

passport.use(new LocalStrategy(
    function(login, password, done) {
      User.findOne({ login: login }, function (err, user) {
        if (err) { return done(err); }
        if (!user) { return done(null, false); }
        if (!user.verifyPassword(password)) { return done(null, false); }
        return done(null, user);
      });
    }
  ));

mongoClient.connect(function (err, client) {
    if(err) throw err;
    usersDB = client.db("usersdb");
    app.listen(3000);
});

//routes

app.set("view engine", "hbs");
hbs.registerPartials(__dirname + "/views/partials");

app.use(express.static(__dirname + "/public", {
    extensions: ['html', 'htm', 'hbs']
}));

app.get("/", function (request, response) {
    response.render("index.hbs", {
        page: "Main",
        name: siteName,
        layout: "/layouts/layout"
    });
});

app.get("/index", function (request, response) {
    response.redirect('/');
});

app.get("/boards", function (request, response) {
    response.render("boards.hbs", {
        page: "Boards list",
        name: siteName,
        layout: "/layouts/layout"
    });
});

app.get("/about", function (request, response) {
    response.render("boards.hbs", {
        page: "Boards list",
        name: siteName,
        layout: "/layouts/layout"
    });
    //i should add here GET request or just request from db i suppose
});

app.post("/register", jsonParser, async function (request, response) {
    if (!request.body) return response.sendStatus(400);
    if (auth.ValidateLogin(request.body.login) && auth.ValidateEmail(request.body.email) && auth.ValidatePassword(request.body.password)) {
            const usersCollection = usersDB.collection("users");
            if (!(await usersCollection.findOne({login: request.body.login})) && !(await usersCollection.findOne({email: request.body.email}))) {
                let saltedPassword = await auth.GenerateHash(request.body.password);
                console.log(saltedPassword);
                let userData = [{
                    login: request.body.login,
                    email: request.body.email,
                    password: saltedPassword,
                    role: "User",
                    validatedEmail: false
                }];
                usersCollection.insertMany(userData, function (err, result) {
                    if (err) {
                        return console.log(err);
                    } else {
                        console.log("New user in DB created! Here the data: ", userData);
                    }
                });
                response.json(request.body);
            }
    } else {
        response.json("Not validated field!");
    }
});

app.post("/login", jsonParser, async function(request, response){
    passport.authenticate('local'),
    { successRedirect: '/',
    failureRedirect: '/login' }
});

app.get("/profile", function(request, response){
    response.render("profile.hbs", {
        page: "Profile",
        name: siteName,
        layout: "/layouts/layout"
    });
});

app.get("/logout", function (req,res){
    req.logout();
    res.redirect("/");
});

app.use(function (req, res, next) {
    res.status(404).sendFile(__dirname + "/public/404.html");
});

app.listen(8080);


process.on("SIGINT", () => {
    dbClient.close();
    process.exit();
});