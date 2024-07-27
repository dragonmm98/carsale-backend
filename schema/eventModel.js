const mongoose = require ("mongoose");
const { product_status_enums, board_article_status } = require("../lib/config");
const Schema = mongoose.Schema;

const eventSchema = new mongoose.Schema ({
    event_name : {type :String, required: true},
    event_type: {
        type: String, 
        required:true, 
    },

    event_status :{
        type: String, 
        required: false,
         default: "active",
          enum:{
            values: board_article_status,
            message:"{VALUE} is not among permitted enum values",
        },
    },
    event_description: {
        type: String,
        required: true,
    },

   event_image: {
    type:Array,
    required:true,
    default:[]
},  
 admin_mb_id:{
    type:Schema.Types.ObjectId,
    ref:"Member",
    required: false
},



}, {timestamps:true} );  // createdAt , UpdatedAt


    module.exports = mongoose.model("Event", eventSchema);