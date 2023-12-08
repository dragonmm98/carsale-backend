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

/*****************MongoDB Related Commands ********************/


exports.shapeIntoMongooseObjectId= (target) => {
    if(typeof target === 'string') {
        return new mongoose.Types.ObjectId(target);
    } else return target; 
}










// mongodb+srv://notailgg:10OJVGyPSh8cbBi0@notailgg.sfp87tq.mongodb.net/PAPAYS?retryWrites=true&w=majority&appName=AtlasApp