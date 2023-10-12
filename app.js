// Express  framework
const express = require ("express");
const app = express ();
const router = require("./router")

// Mongo DB connect 
 const db = require("./server").db();
 const mongodb= require("mongodb");

// Entry codes
app.use(express.static("public"));
app.use(express.json());
app.use (express.urlencoded({extended:true}));

// Session code

// Views Codes 
app.set ("views", "views");
app.set ("view engine","ejs");


//Routing codes
app.use ("/", router);


module.exports= app;