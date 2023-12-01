const express = require("express");
const router = express.Router();
const memberController= require("./controllers/memberController");


/**********************************
*--------------REST API-----------*
*********************************/

// Member routers
// router.get ("/", memberController.home);
router.post ("/signup", memberController.signup);
router.post ("/login", memberController.login);
router.get ("/logout", memberController.logout);
router.get ("/check-me", memberController.checkMyAuthentication);
router.get ("/member/:id",memberController.retrieveAuthMember, memberController.getChosenMember);




// Other routers
router.get ("/menu", function (req,res)
{
    res.send("You are in menu page")
});


router.get ("/community", function (req,res)
{ 
    res.send("You are in community page")
});

module.exports= router;