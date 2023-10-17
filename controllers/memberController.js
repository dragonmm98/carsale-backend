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
        
        res.json ({state:"succeed", data: new_member});
    } catch(err){
        console.log (`ERROR, cont/signup, ${err.message}`);
        res.json({ state:"fail", message: err.message});
    }
};

// ** Login Page**
memberController.login = async (req,res) => {
    try{
        console.log ("post:cont/login");
        const data  = req.body;
        const member = new Member();
        const result = await member.loginData(data);
        
        res.json ({state:"succeed", data: result});
    } catch(err){
        console.log (`ERROR, cont/login, ${err.message}`);
        res.json({ state:"fail", message: err.message});
    }
};
// memberController.login = (req,res) => {
//     console.log ("Post cont.login");
//     res.send ("You are in login page");
// };




memberController.logout = (req,res) => {
    console.log ("Get cont.logout");
    res.send ("You are in logout page");
};