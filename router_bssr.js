const express = require("express");
const router_bssr = express.Router();
const restaurantController= require("./controllers/restaurantController");
const productController=require("./controllers/productController");
const uploader_product = require("./utils/upload-multer")("products"); 
const uploader_members = require("./utils/upload-multer")("members"); 

/**********************************
*--------------BSSR EJS-----------*
*********************************/

// Member routers
 router_bssr.get("/", restaurantController.home);

router_bssr
.get("/sign-up", restaurantController.getSignupMyRestaurant)
.post("/sign-up",uploader_members.single("restaurant_img"), restaurantController.signupProcess);

router_bssr
.get("/login", restaurantController.getLoginMyRestaurant)
.post("/login", restaurantController.loginProcess);

router_bssr.get ("/logout", restaurantController.logout);

router_bssr.get ("/products/menu", restaurantController.getMyRestaurantProducts);
router_bssr.get ("/check-me", restaurantController.checkme);

router_bssr.post ("/products/create",
  restaurantController.validateAuthRestaurant,
  uploader_product.array("product_images", 5),
   productController.addNewProduct);

 router_bssr.post ("/products/edit/:id",
 restaurantController.validateAuthRestaurant,
 productController.updateChosenProduct);


router_bssr.get ("/all-restaurants", 
restaurantController.validateAdmin,
 restaurantController.getAllRestaurants);


 router_bssr.post ("/all-restaurants/update", 
restaurantController.validateAdmin,
 restaurantController.getAllRestaurantsUpdate);


module.exports= router_bssr;