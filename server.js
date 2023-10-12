const dotenv = require("dotenv");
dotenv.config();

const http = require("http");
const mongodb = require ("mongodb");

let db;

const connectionToString = process.env.MONGO_URL;

mongodb.connect (
    connectionToString,
    {
      useNewUrlParser:true,
     useUnifiedTopology:true,
}, 
(err,client) =>{
     if (err) console.log("Error on Connection to MOngoDB");
else {
console.log ('COnnected SUccesfully');
module.exports = client;
    
const app =require ("./app");
const server = http.createServer(app);
let port= process.env.PORT || 3007;
server.listen(port,function (){
console.log (`The server is running successfully on port ${port},http://localhost:${port}`)
})
}    
}

 )