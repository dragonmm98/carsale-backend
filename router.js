const express = require("express");
const router = express.Router();
const memberController= require("./controllers/memberController");

// Member routers
router.get ("/", memberController.home);
router.post ("/signup", memberController.signup);
router.post ("/login", memberController.login);
router.get ("/logout", memberController.logout);



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