const { Mongoose, default: mongoose } = require("mongoose");

exports.member_type_enums = ["USER","ADMIN","DEALER"];
exports.member_status_enums = ["ONPAUSE","ACTIVE","DELETED"];
exports.ordernary_enums = ["Y","N"];
exports.product_collection_enums = ["NEW","USED"];
exports.product_fuel_enums = ["GASOLINE","DIESEL","GAS","ELECTRIC","HYBRID"]
exports.product_status_enums = ["RESERVED","PROCESS","SOLD","DELETED"]
exports.product_size_enums= ["ORDINARY","SPORT","MINI","VAN","TRUCK"];
exports.product_company_enums = ["Tesla","BMW","Ferrari","Ford","Porsche",
"Honda","Lamborghini", "Toyota","Bentley", "Maserati","Audi","Jeep","Subaru","Cadillac","Hyundai","KIA","Samsung","Honda"]

exports.order_status_enums = ["PAUSED", "PROCESS", "FINISHED", "DELETED"];

exports.like_view_group_list = ["product", "member", "community"];
exports.board_id_enums_list = ["dealerfeed", "aboutcars", "recommendation"];
exports.board_article_status = ["active", "deleted"]; 

/*****************MongoDB Related Commands ********************/


exports.shapeIntoMongooseObjectId= (target) => {
    if(typeof target === 'string') {
        return new mongoose.Types.ObjectId(target);
    } else return target; 
};

exports.lookup_auth_member_following = (mb_id, origin) => {
    const follow_id = origin === "follows" ? "$subscriber_id" : "$_id";
    return { 
        $lookup: { 
            from: "follows", 
            let: { 
                lc_follow_id: follow_id, 
                lc_subscriber_id: mb_id, 
                nw_my_following: true, 
            }, 
            pipeline: [ 
                { 
                    $match:{ 
                        $expr: { 
                            $and: [ 
                                {$eq: ["$follow_id", "$$lc_follow_id"]}, 
                                {$eq: ["$subscriber_id", "$$lc_subscriber_id"]}, 
                            ], 
                        }, 
                    }, 
                }, 
                { 
                    $project: { 
                        _id: 0, 
                    subscriber_id: 1, 
                    follow_id: 1, 
                    my_following: "$$nw_my_following", 
                    }, 
                }, 
            ], 
            as: "me_followed", 
        } 
    } 
};

exports.lookup_auth_member_liked = (mb_id) => {
    return { 
        $lookup: { 
            from: "likes", 
            let: { 
                lc_liken_item_id: "$_id", 
                lc_mb_id: mb_id, 
                nw_my_favorite: true, 
            }, 
            pipeline: [ 
                { 
                    $match:{ 
                        $expr: { 
                            $and: [ 
                                {$eq: ["$like_ref_id", "$$lc_liken_item_id"]}, 
                                {$eq: ["$mb_id", "$$lc_mb_id"]}, 
                            ], 
                        }, 
                    }, 
                }, 
                { 
                    $project: { 
                        _id: 0, 
                    mb_id: 1, 
                    like_ref_id: 1, 
                    my_favorite: "$$nw_my_favorite", 
                    }, 
                }, 
            ], 
            as: "me_liked", 
        } 
    } 
};





// mongodb+srv://notailgg:10OJVGyPSh8cbBi0@notailgg.sfp87tq.mongodb.net/PAPAYS?retryWrites=true&w=majority&appName=AtlasApp