const assert = require("assert");
const { shapeIntoMongooseObjectId } = require("../lib/config");
const Definer = require("../lib/mistake");
const MemberModel = require("../schema/member.model");

class Restaurant {
    constructor() {
        this.memberModel=MemberModel
    }
    async getRestaurantsInfo (member, data) {
        try {
          const auth_mb_id = shapeIntoMongooseObjectId(member?._id);
          let match = {mb_type: "RESTAURANT", mb_status: "ACTIVE"};
          let aggregationQuery = [];
          data.limit = data ['limit'] *1;
          data.page = data ['page'] *1;


          switch(data.order) {
            case "top" :
                match ['mb_top'] = 'Y';
                aggregationQuery.push({$match: match});
                aggregationQuery.push({$sample: { size: data.limit }});
                    break;
            case 'random':
                aggregationQuery.push({$match: match});
                aggregationQuery.push({$sample: { size: data.limit }});
                    break;
            default:
                aggregationQuery.push({$match: match});
                const sort = {[data.order]: -1};
                aggregationQuery.push({$sort: sort});
                  break;
          }

          aggregationQuery.push({$skip: (data.page -1) * data.limit});
          aggregationQuery.push({$limit: data.limit});
          // to do::  member liked target 

        const result = await this.memberModel
        .aggregate(aggregationQuery)
        .exec();
        assert.ok(result, Definer.general_err1);
        return result;
        } catch (err) {
            throw err;
        }
    }
    
    
    //---------------************BSSR********--------------//
    //***********BSSR Related MEthods *******/
    async getRestaurantsData () {
        try {
            const result = await this.memberModel
            .find({
                mb_type: "RESTAURANT",
            })
            .exec();

            assert(result, Definer.general_err1);
            return result;
        } catch (err) {
            throw err;
        }
    }

    async getAllRestaurantsUpdateData (update_data) {
        try {
            const id = shapeIntoMongooseObjectId(update_data?.id);
            const result = await this.memberModel.findByIdAndUpdate(
                {_id: id}, 
                update_data, 
                {runValidators:true, lean:true, returnDocument: "after" }
                ).exec();

                assert.ok(result, Definer.general_err1);
                return result;

        } catch (err) {
            throw err;
        }
    }
}


module.exports = Restaurant;