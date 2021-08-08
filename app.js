const express = require("express");
const app = express();
const hbs = require("hbs");
const jsonParser = express.json();
const MongoClient = require("mongodb").MongoClient;
const url = "mongodb://localhost:27017/";
const mongoClient = new MongoClient(url, { useUnifiedTopology: true });

const auth = require("./auth.js");

var clientDatabase;

var siteName = "Imageboard";

app.set("view engine", "hbs");
hbs.registerPartials(__dirname + "/views/partials");

app.use(express.static(__dirname+"/public", {extensions: ['html', 'htm','hbs']}));

mongoClient.connect(function(err,client){
    clientDatabase = client;
    const usersDB = client.db("usersdb");
    const usersCollection = usersDB.collection("users");
    if (err) return console.log(err);
    //app.locals.collection = client.db("usersdb").collection("users"); would be useful in the future
    app.listen(4000, function(){

    });

});

app.get("/", function(request, response){
    response.render("index.hbs",{
        page: "Main",
        name: siteName,
        layout: "/layouts/layout"
    });
});

app.get("/index", function(request, response){
    response.redirect('/');
});

app.get("/boards", function(request, response){
    response.render("boards.hbs",{
        page: "Boards list",
        name: siteName,
        layout: "/layouts/layout"
    });
});

app.post("/register", jsonParser, function (request, response) {
    if(!request.body) return response.sendStatus(400);
    console.log(request.body.login);
    if (auth.ValidateLogin(request.body.login) && !auth.ValidateEmail(request.body.login)){
        if (!usersCollection.findOne({login: request.body.login}) && !usersCollection.findOne({email: request.body.email})){
            saltedPassword = auth.GenerateHash(request.body.password);
            let userData = [{login: request.body.login, email: request.body.email, password: saltedPassword}];
            usersCollection.insertOne(userData, function(err, result){
            if(err){ 
                return console.log(err);
            }
        });
        response.json(request.body);
        }
    }
    else{
        response.json("Not validated field!");
    }
});

app.use(function(req, res, next) {
    res.status(404).sendFile(__dirname+"/public/404.html");
  });

app.listen(8080);

process.on("SIGINT", () => {
    clientDatabase.close();
    process.exit();
});