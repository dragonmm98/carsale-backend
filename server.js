const http = require("http");
const mongodb = require ("mongodb");

let db;

const connectionToString = "mongodb+srv://notailgg:10OJVGyPSh8cbBi0@notailgg.sfp87tq.mongodb.net/REJA?retryWrites=true&w=majority&appName=AtlasApp"

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
let port= 3007;
server.listen(port,function (){
console.log (`The server is running successfully on port ${port},http://localhost:${port}`)
})
}    
}

 )