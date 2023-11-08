const assert = require("assert");
const { shapeIntoMongooseObjectId } = require("../lib/config");
const Definer = require("../lib/mistake");
const MemberModel = require("../schema/member.model");

class Restaurant {
    constructor() {
        this.memberModel=MemberModel
    }

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