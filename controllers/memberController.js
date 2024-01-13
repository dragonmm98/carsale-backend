const Member = require ("../models/Member");
let memberController = module.exports;
const jwt = require('jsonwebtoken');
const assert = require("assert");
const Definer = require("../lib/mistake");

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

        const token =  memberController.createToken(new_member);
      res.cookie("access_token", token, {maxAge: 6 * 3600 * 1000,
         httpOnly: false,
         });
         
        
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

      const token =  memberController.createToken(result);
      res.cookie("access_token", token, {maxAge: 6 * 3600 * 1000,
         httpOnly: false,
         });
        
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
    res.cookie("access_token", null, {maxAge: 0, httpOnly: true});
    res.json ({state:"succeed", data: "Logout Successfully"});
};


memberController.createToken = (result) => {
    try {
        const upload_data = {
            _id: result._id,
            mb_nick: result.mb_nick,
            mb_type: result.mb_type
        };
        const token = jwt.sign (
            upload_data,
            process.env.SECRET_TOKEN,
            {expiresIn: '6h',}
        );

        assert.ok(token, Definer.auth_err4);
        return token


    } catch (err) {
      throw err;
    }
}


memberController.checkMyAuthentication = (req, res) => {
    try {
        console.log ("Get cont/checkMyAuthentication");
        const token = req.cookies["access_token"];
        console.log("token::::", token)

        const member = token ? jwt.verify(token, process.env.SECRET_TOKEN) : null;

        assert.ok(member, Definer.auth_err4);
    
        res.json ({state:"succeed", data: member});
    } catch (err) {
        throw err;
    }
}

memberController.getChosenMember = async (req, res) => {
    try { 
        console.log ("Get cont/getChosenMember");
        const id = req.params.id;
        
        const member = new Member();
        const result = await member.getChosenMemberData(req.member, id);
        res.json ({state:"succeed", data: result});

    } catch (err) {
        console.log (`ERROR, cont/getCHosenMember, ${err.message}`);
        res.json({ state:"fail", message: err.message});
    }
}

memberController.likeMemberChosen = async (req, res) => {
    try { 
        console.log ("POST:: cont/likeMemberChosen");
        assert.ok(req.member, Definer.auth_err5)
        
        const member = new Member();
        const like_ref_id = req.body.like_ref_id;
        const group_type = req.body.group_type;

        const result = await member.likeMemberChosenItemByMember(
            req.member, like_ref_id, group_type);
        res.json ({state:"succeed", data: result});

    } catch (err) {
        console.log (`ERROR, cont/likeMemberChosen, ${err.message}`);
        res.json({ state:"fail", message: err.message});
    }
}

memberController.updateMember = async (req, res) => {
    try { 
        console.log ("POST:: cont/updateMember");
        assert.ok(req.member,Definer.auth_err3);
        const member = new Member();
        const result = await member.updateMemberData(req.member?._id, req.body, req.file);
     
        res.json ({state:"succeed", data: result});

    } catch (err) {
        console.log (`ERROR, cont/updateMember, ${err.message}`);
        res.json({ state:"fail", message: err.message});
    }
}




memberController.retrieveAuthMember = (req, res, next) => {
    try {
    const token = req.cookies["access_token"];
    req.member = token ? jwt.verify(token, process.env.SECRET_TOKEN) : null;
    next();
    } catch (err) {
        console.log (`ERROR, cont/retrieveAuthMember, ${err.message}`);
    next();
    }
};