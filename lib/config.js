const { Mongoose, default: mongoose } = require("mongoose");

exports.member_type_enums = ["USER","ADMIN","DELIVERY","RESTAURANT"];
exports.member_status_enums = ["ONPAUSE","ACTIVE","DELETED"];
exports.ordernary_enums = ["Y","N"];
exports.product_collection_enums = ["dish","salad","dessert","drink","etc"];
exports.product_status_enums = ["PAUSED","PROCESS","DELETED"];
exports.product_size_enums= ["small","normal","large","set"];
exports.product_volume_enums= [0.5,1,1.2,1.5,2];

exports.order_status_enums = ["PAUSED", "PROCESS", "FINISHED", "DELETED"];

exports.like_view_group_list = ["product", "member", "community"];
exports.board_id_enums_list = ["celebrity", "evaluation", "story"];
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
}





// mongodb+srv://notailgg:10OJVGyPSh8cbBi0@notailgg.sfp87tq.mongodb.net/PAPAYS?retryWrites=true&w=majority&appName=AtlasApp