const express = require("express");
const app = express();
const hbs = require("hbs");
const jsonParser = express.json();
const MongoClient = require("mongodb").MongoClient;
const url = "mongodb://localhost:27017/";
const mongoClient = new MongoClient(url, {useUnifiedTopology: true});
const session = require('express-session');
const cookie = require('cookie-parser');

const auth = require("./auth.js");

var siteName = "Imageboard";
const port = 8080;
const secretKey = "ggjieqfsgjagsgwwsyh44yhgswgaqfva";
var usersDB;

const week = 1000 * 60 * 60 * 24 * 7;

app.set('trust proxy', 1)
app.use(sessions({
  secret: secretKey,
  resave: false,
  saveUninitialized: true,
  cookie: { maxAge: week}
}));
app.use(express.urlencoded({ extended: true }));
app.use(express.static(__dirname));

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
                        response.status(201).json({message: "registered", status: 201});
                    }
                });
                
            }
    } else {
        response.json("Not validated field!");
    }
});

app.post("/signin", jsonParser, async function(request, response){
    if (!request.body) return response.sendStatus(400);
    console.log(request.body.login);
    if (auth.ValidateLogin(request.body.login) && auth.ValidatePassword(request.body.password)) {
        const usersCollection = usersDB.collection("users");
        var currUser = await usersCollection.find({login: request.body.login}).toArray();
        if (!(await usersCollection.findOne({login: request.body.login}))){
            if(await auth.ComparePassword(currUser[0].password, request.body.password)){
                
                usersCollection.insertMany(userData, function (err, result) {
                    if (err) {
                        return console.log(err);
                    } else {
                        console.log("User just logged! Here his login: ", request.body.login);
                        response.status(201).json({message: "signedin", status: 201});
                    }
                });
            }
            else{
                response.status(401).json({error: "invalidpassword", status: 401});
            }
        }
        else{
            response.status(401).json({error: "invalidlogin", status: 401});
        }
};
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

app.listen(port);



process.on("SIGINT", () => {
    dbClient.close();
    process.exit();
});