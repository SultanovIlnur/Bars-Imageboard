const express = require("express");
const hbs = require("hbs");
const MongoClient = require("mongodb").MongoClient;
const url = "mongodb://localhost:27017/";
const mongoClient = new MongoClient(url, { useUnifiedTopology: true });
const app = express();

var siteName = "Imageboard";

app.set("view engine", "hbs");
hbs.registerPartials(__dirname + "/views/partials");

app.use(express.static(__dirname+"/public", {extensions: ['html', 'htm','hbs']}));

mongoClient.connect(function(err,client){
    const db = client.db("usersdb");
    const collection = db.collection("users");
    
    if (err){
        return console.log(err);
    }
    client.close()
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

app.use(function(req, res, next) {
    res.status(404).sendFile(__dirname+"/public/404.html");
  });

app.listen(8080);