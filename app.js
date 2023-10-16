// Express  framework
const express = require ("express");
const app = express ();
const router = require("./router")

// Mongo DB connect 

// Entry codes
app.use(express.static("public"));
app.use(express.json());
app.use (express.urlencoded({extended:true}));

// Session code
// app.use (
//     session({
//         secret:process.env.SESSION_SECRET,
//         cookies:{
//             maxAge: 1000*60*30,  //for 30 minutes
    
//         },
//         store:store,
//         resave:true,
//         saveUninitialized: true,
//     }) 
// );

// Views Codes 
app.set ("views", "views");
app.set ("view engine","ejs");


//Routing codes
app.use ("/", router);
// app.use ("/resto", router_bssr); //ananaviy yo'l

module.exports= app;