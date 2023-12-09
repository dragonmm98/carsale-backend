const express = require("express");
const router = express.Router();
const memberController= require("./controllers/memberController");
const productController = require("./controllers/productController");
const restaurantController = require("./controllers/restaurantController");
const orderController = require("./controllers/orderController");


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

// Product based Routers

router.post ("/products",
memberController.retrieveAuthMember,
 productController.getAllProducts);

router.get ("/products/:id",
 memberController.retrieveAuthMember, 
productController.getChosenProduct); 



// Restaurant Based Routers 

router.get("/restaurants",
 memberController.retrieveAuthMember,
 restaurantController.getRestaurants);

 router.get ("/restaurants/:id", 
 memberController.retrieveAuthMember,
 restaurantController.getChosenRestaurant);


 //Order Based Routers 
 router.post ("/orders/create", 
 memberController.retrieveAuthMember,
 orderController.createOrder);

 router.get ("/orders", 
 memberController.retrieveAuthMember,
 orderController.getMyOrders)

 router.post ("/orders/edit", 
 memberController.retrieveAuthMember,
 orderController.editChosenOrder);

 
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