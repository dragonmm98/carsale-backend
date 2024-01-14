// Express  framework
const express = require ("express");
const app = express ();
const router = require("./router.js")
const router_bssr = require("./router_bssr.js");
const cookieParser = require("cookie-parser");
const cors = require("cors");
const http = require("http");



let session = require("express-session");
const MongoDBStore = require("connect-mongodb-session") (session);
const store = new MongoDBStore({
    uri: process.env.MONGO_URL,
    collection: "sessions",
});


// Entry codes
app.use(express.static("public"));
app.use("/uploads", express.static(__dirname + "/uploads"))
app.use(express.json());
app.use (express.urlencoded({extended:true}));
app.use(cors({
    credentials:true,
    origin:true,
})
);
app.use (cookieParser());


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

const server = http.createServer(app);
//***SOCKET.IO BACKEND SERVER ****/
const io = require("socket.io")(server,
    {serveClient: false, 
    origins: "*:*",
    transport: ["websocket", "xhr-polling"],
})

let online_users = 0;
io.on("connection", function(socket) {
    online_users++;
    console.log("New user, total:", online_users)
    socket.emit("greetMsg",{text: "welcome"});
    io.emit("infoMsg", {total: online_users});

    socket.on("disconnect", function() {
        online_users--;
        socket.broadcast.emit("infoMsg", 
        {total: online_users})
        console.log("Client disconnected, total:", online_users)
    })
    socket.on("createMsg", function(data) {
        console.log(data);
        io.emit("newMsg", data)
    });
})

//teacher uses socket.io  2.3.0 versioon

module.exports= server;