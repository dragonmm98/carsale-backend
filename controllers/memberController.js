const Member = require ("../models/Member");
let memberController = module.exports;

// memberController.home = (req,res) => {
//     console.log ("Get cont.home");
//     res.send ("You are in homepage");
// };


memberController.signup = async (req,res) => {
    try{
        console.log ("post:cont/signup");
        const data  = req.body;
        const member = new Member();
        const new_member = await member.signupData(data);
        

        res.send('done');
    } catch(err){
        console.log (`ERROR, cont/signup, ${err.messege}`);
    }
};


memberController.login = (req,res) => {
    console.log ("Post cont.login");
    res.send ("You are in login page");
};


memberController.logout = (req,res) => {
    console.log ("Get cont.logout");
    res.send ("You are in logout page");
};