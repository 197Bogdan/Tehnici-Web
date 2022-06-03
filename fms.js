const express = require('express');
const crypto = require('crypto');
const fs = require('fs');
const session = require('express-session');
const port = 8081;
const accounts = __dirname + "/resurse/json/conturi.json";

app = express();
app.set("view engine", "ejs");

app.use(session({
    secret: "l02;qSq",
    resave: true,
    saveUninitialized: false
}));

app.use("/resurse", express.static(__dirname + "/resurse"));

app.use(express.urlencoded({extended:true}));

app.get(["/", "/home"], function(req, res){
    res.render("pagini/home", {user: req.session.user});
})

app.get("/logout", function(req, res){
    req.session.destroy();
    res.render("pagini/home");
})


app.post("/login", function(req, res){
    if(fs.existsSync(accounts)){
        accountsString = fs.readFileSync(accounts).toString("utf8");
        accountsObj = JSON.parse(accountsString);
    }
    else{
        accountsObj = {users: []};
    }
    req.body.password=crypto.scryptSync(req.body.password, "A128j'q", 32).toString("hex");
    for(let user of accountsObj.users)
        if(user.password == req.body.password && user.username == req.body.username)
        {
            req.session.user = user;
            res.render("pagini/home", {user: req.session.user, login:"yes"});
            return;
        }
    res.render("pagini/home", {user: null, login:"no"});
})
app.post("/signup", function(req, res){
    if(fs.existsSync(accounts)){
        accountsString = fs.readFileSync(accounts).toString("utf8");
        accountsObj = JSON.parse(accountsString);
    }
    else{
        accountsObj = {users: []};
    }
    for(let user of accountsObj.users)
        if(user.username == req.body.username)
        {
            res.render("pagini/signup", {user: req.session.user, answer: "exists"});
            return;
        }
    req.body.password=crypto.scryptSync(req.body.password, "A128j'q", 32).toString("hex");
    req.body.lvl = "1";
    req.body.exp = "0";
    accountsObj.users.push(req.body);
    fs.writeFileSync(accounts, JSON.stringify(accountsObj));
    
    res.render("pagini/signup", {user: req.session.user, answer: "ok"});
})

app.get("/*", function(req, res){
    res.render("pagini" + req.url, {user: req.session.user}, function(err, rezultatRandare){
        if(err)
            res.render("pagini/404", {user: req.session.user}); 
        else 
            res.send(rezultatRandare);
    });
});

app.listen(port);
console.log("Serverul a pornit. Port: " + port);