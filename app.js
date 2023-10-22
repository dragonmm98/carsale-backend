// Express  framework
const express = require ("express");
const app = express ();
const router = require("./router.js")
const router_bssr = require("./router_bssr.js");



let session = require("express-session");
const MongoDBStore = require("connect-mongodb-session") (session);
const store = new MongoDBStore({
    uri: process.env.MONGO_URL,
    collection: "sessions",
});


// Entry codes
app.use(express.static("public"));
app.use(express.json());
app.use (express.urlencoded({extended:true}));

// Session code
app.use(
    session ({
        secret: process.env.SESSION_SECRET,
        cookie: {
            maxAge: 1000* 60 * 30, // for 30 min
        },
        store: store,
        resave: true,
        saveUninitialized: true,
    })
);
app.use(function (req,res,next) {
    res.locals.member = req.session.member;
    next();
});

// Views Codes 
app.set ("views", "views");
app.set ("view engine","ejs");


//Routing codes
app.use ("/", router);
app.use ("/resto", router_bssr); //ananaviy yo'l

module.exports= app;