const assert = require("assert");
const { shapeIntoMongooseObjectId, lookup_auth_member_liked } = require("../lib/config");
const Definer = require("../lib/mistake");
const MemberModel = require("../schema/member.model");
const Member = require("./Member")

class Dealer {
    constructor() {
        this.memberModel=MemberModel
    }
    async getDealersInfo (member, data) {
        try {
          const auth_mb_id = shapeIntoMongooseObjectId(member?._id);
          let match = {mb_type: "DEALER", mb_status: "ACTIVE"};
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
          aggregationQuery.push(lookup_auth_member_liked(auth_mb_id));


        const result = await this.memberModel
        .aggregate(aggregationQuery)
        .exec();
        assert.ok(result, Definer.general_err1);
        return result;
        } catch (err) {
            throw err;
        }
    }
    

    async getChosenDealerData (member,id) {
        try {
            id = shapeIntoMongooseObjectId(id);
            if(member) {
             const member_obj = new Member();
             await member_obj.viewChosenItemByMember(member,id, "member");
            }
           const result = await this.memberModel.findOne({
            _id: id,
            mb_status: "ACTIVE",

           }).exec();
           assert.ok (result, Definer.general_err2);
           return result;

        } catch (err) {
            throw err;
        }
    }
    
    //---------------************BSSR********--------------//
    //***********BSSR Related MEthods *******/
    async getDealersData () {
        try {
            const result = await this.memberModel
            .find({
                mb_type: "DEALER",
            })
            .exec();

            assert(result, Definer.general_err1);
            return result;
        } catch (err) {
            throw err;
        }
    }

    async getAllDealersUpdateData (update_data) {
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


module.exports = Dealer;