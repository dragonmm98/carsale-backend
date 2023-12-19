const assert = require("assert");
const { shapeIntoMongooseObjectId, lookup_auth_member_liked } = require("../lib/config");
const Definer = require("../lib/mistake");
const ProductModel= require("../schema/product.model");
const Member = require("./Member");

class Product {
    constructor () {
       this.productModel=ProductModel;
        
     }
     
     /*********get All Products and mb_view upgrade functions ***** */
     async getAllProductsData (member, data) {
        try { 
            const auth_mb_id = shapeIntoMongooseObjectId(member?._id);

            let match = {product_status: "PROCESS"};
            if (data.restaurant_mb_id) {
                match ["restaurant_mb_id"] = shapeIntoMongooseObjectId(
                    data.restaurant_mb_id
                );
                match["product_collection"] = data.product_collection;
            }

            const sort = 
            data.order === "product_price" 
            ? { [data.order] : 1 } 
            : { [data.order] : -1 };

            const result = await this.productModel.aggregate([
                {$match: match },
                {$sort: sort},
                {$skip: (data.page * 1 -1) * data.limit },
                {$limit: data.limit * 1 },
                (lookup_auth_member_liked(auth_mb_id))

            ])
            .exec();

            assert.ok(result, Definer.general_err1);
            return result;

        } catch (err) {
            throw err;
        }
        }
      
    /****************Get CHosen Product  ***************/    
  async getChosenProductData (member, id) {
    try {
        const auth_mb_id = shapeIntoMongooseObjectId(member?._id);
        id = shapeIntoMongooseObjectId(id);

        if(member) {
            const member_obj = new Member();
           await member_obj.viewChosenItemByMember(member,id, "product");
        }

        const result = await this.productModel.aggregate ([
         { $match: {_id: id, product_status: "PROCESS"}},
        (lookup_auth_member_liked(auth_mb_id))      
        ]).exec();
        
        assert.ok(result, Definer.general_err1);
        return result;

    } catch (err) {
        throw err;
    }
  }


     /**************BSSR RELATED STATIC METHODS ****************/
     async getAllProductsDataResto(member) {
        try {
            
            member._id = shapeIntoMongooseObjectId(member._id);
              const result = await this.productModel.find({
                restaurant_mb_id: member._id,
            });
            assert.ok(result,Definer.general_err1);
            return result;
        } catch (err) {
            throw err;
        }
     }

     async addNewProductData (data,member) {
        try{
        data.restaurant_mb_id = shapeIntoMongooseObjectId(member._id);
        

        const new_product = new this.productModel(data);
        const result = await new_product.save();

        assert.ok(result,Definer.product_err1);
        return result;

        return true;
        } catch (err) {
            throw err;
        }
     }

     async updateChosenProduct (id,updated_data,mb_id) {
        try {
            id= shapeIntoMongooseObjectId(id);
            mb_id =shapeIntoMongooseObjectId(mb_id);

            const result= await this.productModel
            .findOneAndUpdate({_id: id, restaurant_mb_id: mb_id},
                updated_data,
                {
                    runValidators:true,
                    lean:true,
                    returnDocument:"after",
                }
            ).exec();

            assert.ok(result,Definer.general_err1);
            return result;

        } catch (err) {
            throw err;
        }
     }

}

module.exports = Product;