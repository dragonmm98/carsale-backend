let memberController = module.exports;

memberController.home = (req,res) => {
    console.log ("Get cont.home");
    res.send ("You are in homepage");
};


memberController.signup = (req,res) => {
    console.log ("Post cont.signup");
    res.send ("You are in signup page");
};


memberController.login = (req,res) => {
    console.log ("Post cont.login");
    res.send ("You are in login page");
};


memberController.logout = (req,res) => {
    console.log ("Get cont.logout");
    res.send ("You are in logout page");
};