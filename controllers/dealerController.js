const assert = require("assert");
const Definer = require("../lib/mistake");
const Member = require ("../models/Member");
const Product = require ("../models/Product")
const Dealers = require ("../models/Dealer")

let dealerController = module.exports;

   //*******Rest API ******/
dealerController.getDealers = async (req, res) => {
    try {
        console.log ("GET:connect/getDealers");
        const data = req.query;
        const dealer = new Dealers();
        const result = await dealer
        .getDealersInfo(req.member, data);
        res.json({ state: "success", data: result })
    } catch (err) {
        console.log (`ERROR, connect/getDealers, ${err.message}`);
        res.json ({ state: "fail", message: err.message});
    }
}

dealerController.getChosenDealer = async (req,res) => {
    try {
        console.log ("GET:connect/getChosenDealer");
        const id = req.params.id;
        const dealer = new Dealers();
       const result = await dealer.getChosenDealerData(req.member, id);
        
        
        res.json({ state: "success", data: result })
    } catch (err) {
        console.log (`ERROR, cont/getChosenDealer, ${err.message}`);
        res.json ({ state: "fail", message: err.message});

    }
}



        /******************************
         ******BSSR RELATED METHODS*** 
        *****************************/
         dealerController.home= (req,res) => {
            try {
                console.log ("GET:connect/home");
                res.render("home-page");
            } catch (err) {
                console.log (`ERROR, connect/home, ${err.message}`);
                res.json ({ state: "fail", message: err.message});
            }
        }
        
        dealerController.getSignupMyDealerPage = async (req,res) => {
            try {
                console.log ("GET: connect/getSignupMyDealerPage");
                res.render ("signup");
            } catch (err) {
                console.log (`ERROR, connect/getSignupMyDealerPage, ${err.message}`);
                res.json ({ state: "fail", message: err.message});
            }
        
        }
         dealerController.signupProcess = async (req,res) => {
            try{
                console.log ("POST:connect/signupMyDealersPage");
                assert( req.file,Definer.general_err3);
                
                let data  = req.body;
                data.mb_type = "DEALER";
                data.mb_image = req.file.path.replace(/\\/g, "/");
                
                const member = new Member();
                const new_member = await member.signupData(data);
                assert (new_member, Definer.general_err1);
        
                req.session.member = new_member;
                res.redirect('/dealers/products/menu');
        
                } catch(err){
                console.log (`ERROR, connect/signupMyDealersPage, ${err.message}`);
                res.json({ state:"fail", message: err.message});
            }
        };
        
        // ** Login Page**
        dealerController.getLoginMyDealerPage = async (req,res) => {
            try {
                console.log ("GET: connect/getLoginMyDealerPage");
                res.render ('login-page');
            } catch (err) {
                console.log (`ERROR, connect/getLoginMyDealerPage, ${err.message}`);
                res.json ({ state: "fail", message: err.message});
            }
        
        };
        
        
        
        dealerController.loginProcess = async (req,res) => {
            try{
                console.log ("post:connect/loginProcess");
                const data  = req.body;
                const member = new Member();
                const result = await member.loginData(data);
        
                req.session.member = result;
                req.session.save (function () {
                    result.mb_type === "ADMIN" 
                    ? res.redirect ("/dealers/all-dealers")
                    : res.redirect ("/dealers/products/menu");
                }); 
                
            
            } catch(err){
                console.log (`ERROR, connect/login, ${err.message}`);
                res.json({ state:"fail", message: err.message});
            }
        };
        dealerController.logout = (req,res) => {
            try {
                console.log ("GET connect/logout");
                req.session.destroy(function () {
                    res.redirect("/dealers");
                }); 
            } catch (err) {
                console.log (`ERROR, connect/logout, ${err.message}`);
                res.json({ state:"fail", message: err.message});
        
            }
        };
        dealerController.getMyDealerProducts = async (req,res) => {
            try {
                console.log ("GET: connect/getMyDealerProducts");
                const product = new Product();
                const data = await product.getAllProductsDataDealer(res.locals.member);  
                res.render('dealers-menu',{dealer_data:data});
                
            } catch (err) {
                console.log (`ERROR, connect/getMyDealerProducts, ${err.message}`);
                res.redirect("/dealers");
            }
        }

        dealerController.validateAuthDealer=(req,res,next) => {
            if(req.session?.member?.mb_type==="DEALER") {
                req.member =req.session.member;
                next();
            } else 
               res.json ({
                state: "fail",
                message: "only authenticated members with Dealer type",
               });
        };

        dealerController.checkme = (req,res) => {
            if ( req.session?.member) {
                res.json ({state: "succeed", data: req.session.member})
            } else {
                res.json ({state : "fail", message : "Your are not authenticated"});
            }
        };

        dealerController.validateAdmin=(req,res,next) => {
            if(req.session?.member?.mb_type==="ADMIN") {
                req.member =req.session.member;
                next();
            } else {
                const html = `<script>alert("Not Permitted!!! The Page is only for Admins"); window.location.replace("/dealers"); </script>`;
                res.end(html);
            }
        };

        dealerController.getAllDealers = async (req,res) => {
            try {
                console.log ("GET connect/getAllDealers");
                 const dealers = new Dealers();
                 const product = new Product();
                 const dealers_data = await dealers.getDealersData();
                 const event_data = await product.getAllEventsDataAdmin(res.locals.member);
                   
                  res.render("all-dealers",{
                    dealers_data: dealers_data,
                    event_data: event_data
                });
        
            } catch (err) {
                console.log (`ERROR, connect/logout, ${err.message}`);
                res.json({ state:"fail", message: err.message});
            }
        }
        
        
        // Admin log
        
        dealerController.getAllDealersUpdate = async (req, res) => {
          try {
          
            console.log ("POST connect/getAllDealersUpdate");
            const dealers = new Dealers();
            const result = await dealers.getAllDealersUpdateData(req.body);
            await res.json({state: "success", data: result});
          
        } catch (err) {
            console.log (`ERROR, connect/getAllDealersUpdate, ${err.message}`);
             res.json({ state:"fail", message: err.message});
          }
        }