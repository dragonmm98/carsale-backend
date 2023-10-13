const dotenv = require("dotenv");
dotenv.config();

const http = require("http");
const mongoose = require ("mongoose");

const connectionToString = process.env.MONGO_URL;

mongoose
  .connect(connectionToString, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => {
    console.log("Mongoose Connected Successfully",);

    const app = require("./app");
    const server = http.createServer(app);
    let port = process.env.PORT || 3007;

    server.listen(port, function () {
      console.log(`The server is running successfully on port ${port}, http://localhost:${port}`);
    });
  })
  .catch((err) => {
    console.log("Error on Connection to MongoDB:", err);
  });





















// mongoose.connect (
//     connectionToString,
//     {
//       useNewUrlParser:true,
//      useUnifiedTopology:true,
// }, 
// (err) =>{
//      if (err) console.log("Error on Connection to MOngoDB",err);
// else {
// console.log ('Mongoose Connected SUccesfully');


    
// const app =require ("./app");
// const server = http.createServer(app);
// let port= process.env.PORT || 3007;
// server.listen(port,function (){
// console.log (`The server is running successfully on port ${port},http://localhost:${port}`)
// })
// }    
// }

//  )