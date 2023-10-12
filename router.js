const express = require("express");
const router = express.Router();

router.get ("/", function (req,res)
{
    res.send("You are in homepage")
});

router.get ("/menu", function (req,res)
{
    res.send("You are in menu page")
});


router.get ("/community", function (req,res)
{
    res.send("You are in community page")
});

module.exports= router;