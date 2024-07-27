const express = require("express");
const router_bssr = express.Router();
const dealerController= require("./controllers/dealerController");
const productController=require("./controllers/productController");
const uploader_product = require("./utils/upload-multer")("products"); 
const uploader_members = require("./utils/upload-multer")("members"); 
const uploader_event = require ("./utils/upload-multer")("community");

/**********************************
*--------------BSSR EJS-----------*
*********************************/

// Member routers
 router_bssr.get("/", dealerController.home);

router_bssr
.get("/signup", dealerController.getSignupMyDealerPage)
.post("/signup",uploader_members.single("dealers_img"), dealerController.signupProcess);

router_bssr
.get("/login", dealerController.getLoginMyDealerPage)
.post("/login", dealerController.loginProcess);

router_bssr.get ("/logout", dealerController.logout);

router_bssr.get ("/products/menu", dealerController.getMyDealerProducts);
router_bssr.get ("/check-me", dealerController.checkme);

router_bssr.post ("/products/create",
  dealerController.validateAuthDealer,
  uploader_product.array("product_images", 5),
   productController.addNewProduct);

   router_bssr.post ("/event/create",
  dealerController.validateAdmin,
  uploader_event.single("event_image"),
   productController.addNewEvent);

 router_bssr.post ("/products/edit/:id",
 dealerController.validateAuthDealer,
 productController.updateChosenProduct);

 router_bssr.post ("/event/edit/:id",
 dealerController.validateAdmin,
 productController.updateChosenEvent);


router_bssr.get ("/all-dealers", 
dealerController.validateAdmin,
 dealerController.getAllDealers);


 router_bssr.post ("/all-dealers/update", 
dealerController.validateAdmin,
 dealerController.getAllDealersUpdate);


module.exports= router_bssr;