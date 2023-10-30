const Member = require ("../models/Member");
const Product = require ("../models/Product");

let restaurantController = module.exports;

restaurantController.home= (req,res) => {
    try {
        console.log ("Get:cont/home");
        res.render("home-page");
    } catch (err) {
        console.log (`ERROR, cont/home, ${err.message}`);
        res.json ({ state: "fail", message: err.message});
    }
}

restaurantController.getSignupMyRestaurant = async (req,res) => {
    try {
        console.log ("GET: cont/getSignUpMyRestaruant");
        res.render ('signup');
    } catch (err) {
        console.log (`ERROR, cont/getSignUpMyRestaurant, ${err.message}`);
        res.json ({ state: "fail", message: err.message});
    }

}

restaurantController.getMyRestaurantProducts = async (req,res) => {
    try {
        console.log ("GET: cont/getMyRestaurantProducts");
        // TODO Get my restaurant products
        const product = new Product();
        const data = await product.getAllProductsDataResto(res.locals.member);   
        res.render('restaurant-menu',{restaurant_data:data});
        
    } catch (err) {
        console.log (`ERROR, cont/getAllProductsDataResto, ${err.message}`);
        res.json ({ state: "fail", message: err.message});
    }
}

restaurantController.signupProcess = async (req,res) => {
    try{
        console.log ("post:cont/signup");
        const data  = req.body;
        const member = new Member();
        const new_member = await member.signupData(data);

        req.session.member = new_member;
        res.redirect('/resto/products/menu');

        
        
    } catch(err){
        console.log (`ERROR, cont/signup, ${err.message}`);
        res.json({ state:"fail", message: err.message});
    }
};

// ** Login Page**
restaurantController.getLoginMyRestaurant = async (req,res) => {
    try {
        console.log ("GET: cont/getLoginMyRestaruant");
        res.render ('login-page');
    } catch (err) {
        console.log (`ERROR, cont/getLoginMyRestaurant, ${err.message}`);
        res.json ({ state: "fail", message: err.message});
    }

};



restaurantController.loginProcess = async (req,res) => {
    try{
        console.log ("post:cont/loginProcess");
        const data  = req.body;
        const member = new Member();
        const result = await member.loginData(data);

        req.session.member = result;
        req.session.save (function () {
            result.mb_type === "ADMIN" 
            ? res.redirect ("/resto/all-restaurant")
            : res.redirect ("/resto/products/menu");
        }); 
        
    
    } catch(err){
        console.log (`ERROR, cont/login, ${err.message}`);
        res.json({ state:"fail", message: err.message});
    }
};





restaurantController.logout = (req,res) => {
    console.log ("Get cont.logout");
    res.send ("You are in logout page");
};

restaurantController.validateAuthRestaurant=(req,res,next) => {
    if(req.session?.member?.mb_type==="RESTAURANT") {
        req.member =req.session.member;
        next();
    } else 
       res.json ({
        state: "fail",
        message: "only authenticated members with restaurant type",
       });
};

restaurantController.checkme = (req,res) => {
    if ( req.session?.member) {
        res.json ({state: "succeed", data: req.session.member})
    } else {
        res.json ({state : "fail", message : "Your are not authenticated"});
    }
};