const assert = require("assert");
const Definer = require("../lib/mistake");
const Member = require ("../models/Member");
const Product = require ("../models/Product");
const Restaurant = require("../models/Restaurant");

let restaurantController = module.exports;

   //*******Rest API ******/
restaurantController.getRestaurants = async (req, res) => {
    try {
        console.log ("Get:cont/getRestaurants");
        const data = req.query;
        const restaurant = new Restaurant();
        const result = await restaurant
        .getRestaurantsInfo(req.member, data);
        res.json({ state: "success", data: result })
    } catch (err) {
        console.log (`ERROR, cont/getRestaurants, ${err.message}`);
        res.json ({ state: "fail", message: err.message});
    }
}

restaurantController.getChosenRestaurant = async (req,res) => {
    try {
        console.log ("Get:cont/getChosenRestaurant");
        const id = req.params.id;
        const restaurant = new Restaurant();
       const result = await restaurant.getChosenRestaurantData(req.member, id);
        
        
        res.json({ state: "success", data: result })
    } catch (err) {
        console.log (`ERROR, cont/getChosenRestaurant, ${err.message}`);
        res.json ({ state: "fail", message: err.message});

    }
}







        /******************************
         ******BSSR RELATED METHODS*** 
        *****************************/
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
        const product = new Product();
        const data = await product.getAllProductsDataResto(res.locals.member);   
        res.render('restaurant-menu',{restaurant_data:data});
        
    } catch (err) {
        console.log (`ERROR, cont/getMyRestaurantProducts, ${err.message}`);
        res.redirect("/resto");
    }
}

restaurantController.signupProcess = async (req,res) => {
    try{
        console.log ("post:cont/signup");
        assert( req.file,Definer.general_err3);
        
        let data  = req.body;
        data.mb_type = "RESTAURANT";
        data.mb_image = req.file.path.replace(/\\/g, "/");
        
        const member = new Member();
        const new_member = await member.signupData(data);
        assert (new_member, Definer.general_err1);

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
            ? res.redirect ("/resto/all-restaurants")
            : res.redirect ("/resto/products/menu");
        }); 
        
    
    } catch(err){
        console.log (`ERROR, cont/login, ${err.message}`);
        res.json({ state:"fail", message: err.message});
    }
};





restaurantController.logout = (req,res) => {
    try {
        console.log ("Get cont/logout");
        req.session.destroy(function () {
            res.redirect("/resto");
        }); 
    } catch (err) {
        console.log (`ERROR, cont/logout, ${err.message}`);
        res.json({ state:"fail", message: err.message});

    }
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

restaurantController.validateAdmin=(req,res,next) => {
    if(req.session?.member?.mb_type==="ADMIN") {
        req.member =req.session.member;
        next();
    } else {
        const html = `<script>alert("Not Permitted!!! The Page is only for Admins"); window.location.replace('/resto'); </script>`;
        res.end(html);
    }
};


restaurantController.getAllRestaurants = async (req,res) => {
    try {
        console.log ("GET cont/getAllRestaurants");
         const restaurant = new Restaurant();
         const restaurant_data = await restaurant.getRestaurantsData();

          res.render("all-restaurants", {restaurant_data: restaurant_data});

    } catch (err) {
        console.log (`ERROR, cont/logout, ${err.message}`);
        res.json({ state:"fail", message: err.message});
    }
}


// Admin log

restaurantController.getAllRestaurantsUpdate = async (req, res) => {
  try {
  
    console.log ("POST cont/getAllRestaurantsUpdate");
    const restaurant = new Restaurant();
    const result = await restaurant.getAllRestaurantsUpdateData(req.body);
    await res.json({state: "success", data: result});
  
} catch (err) {
    console.log (`ERROR, cont/getAllRestaurantUpdate, ${err.message}`);
     res.json({ state:"fail", message: err.message});
  }
}