const mongoose = require ("mongoose");
const { product_collection_enums, product_status_enums, product_size_enums, product_volume_enums, product_company_enums, product_fuel_enums } = require("../lib/config");

const Schema = mongoose.Schema;

const productSchema = new mongoose.Schema ({
    product_name : {type :String, required: true},
    product_collection: {
        type: String, 
        required:true, 
        enum:{
            values: product_collection_enums,
            message:"{VALUE} is not among permitted enum values",
        },
    },

    product_status :{
        type: String, 
        required: false,
         default: "RESERVED",
          enum:{
            values: product_status_enums,
            message:"{VALUE} is not among permitted enum values",
        },
    },
    product_price: {
        type: String,
        required: true,
    },
    product_discount: {
        type: Number,
        required: false,
        default:0,
    },
    product_milaege: {
        type: String,
        required: true,
        default:"0km",
    },
    product_fuel_type: {
        type: String,
        required: true,
        enum: {
            values: product_fuel_enums,
            message:"{VALUE} is not among permitted enum values",
        }
    },
   product_size: {
    type: String,
    default:"ORDINARY",
    required: true,
    enum:{
        values: product_size_enums,
        message:"{VALUE} is not among permitted enum values",
        
    },
    },
    product_company: {
        type: String,
        required: true,
    },
    product_color: {
      type: String,
      required: true,
    },
   product_year: {
    type:Number,
    required:true,
    },
   product_description:{
    type:String,
    required:false
   },
   product_images: {
    type:Array,
    required:true,
    default:[]
},
product_likes: {
    type:Number,
    required:false,
    default:0
},
product_views:{
    type:Number,
    required:false,
    default:0
},
dealers_mb_id:{
    type:Schema.Types.ObjectId,
    ref:"Member",
    required: false
},



}, {timestamps:true} );  // createdAt , UpdatedAt

productSchema.index(
    {dealers_mb_id:1, product_name:1, product_size:1, product_year:1, product_collection_enums: 1},
    {unique:true}
    );

    module.exports = mongoose.model("Product",productSchema);