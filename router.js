const express = require("express");
const router = express.Router();
const memberController= require("./controllers/memberController");
const followController= require("./controllers/followController");
const productController = require("./controllers/productController");
const dealerController = require("./controllers/dealerController");
const orderController = require("./controllers/orderController");
const communityController = require("./controllers/communityController");
const uploader_community = require ("./utils/upload-multer")("community");
const uploader_member = require ("./utils/upload-multer")("members");


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

router.post ("/member-liken", 
memberController.retrieveAuthMember,
memberController.likeMemberChosen)

router.post("/member/update", 
memberController.retrieveAuthMember,
uploader_member.single("mb_image"), 
memberController.updateMember)

// Product based Routers

router.post ("/products",
memberController.retrieveAuthMember,
 productController.getAllProducts);

 router.get ("/filter",
memberController.retrieveAuthMember,
 productController.getSizeProducts);

router.get ("/products/:id",
 memberController.retrieveAuthMember, 
productController.getChosenProduct); 



// Dealer Based Routers 

router.get("/dealer",
 memberController.retrieveAuthMember,
 dealerController.getDealers);

 router.get ("/dealer/:id", 
 memberController.retrieveAuthMember,
 dealerController.getChosenDealer);


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

 
 // Community Related Routers
router.post("/community/image", 
uploader_community.single("community_image"),
communityController.imageInsertion);

router.post ("/community/create", 
memberController.retrieveAuthMember,
communityController.createArticle);

router.get ("/community/articles",
memberController.retrieveAuthMember,
communityController.getMemberArticles);

router.get ("/community/events",
memberController.retrieveAuthMember,
communityController.getEvents);

router.get ("/community/target", 
memberController.retrieveAuthMember,
communityController.getArticles);

router.get ("/community/single-article/:art_id",
memberController.retrieveAuthMember,
communityController.getChosenArticle)



// Following related Routers*****
router.post ("/follow/subscribe",
memberController.retrieveAuthMember,
followController.subscribe);

router.post("/follow/unsubscribe",
memberController.retrieveAuthMember,
followController.unsubscribe);

router.get ("/follow/followings",
followController.getMemberFollowings)

router.get ("/follow/followers",
memberController.retrieveAuthMember,
followController.getMemberFollowers)



module.exports= router;