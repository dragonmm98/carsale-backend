
const MemberModel = require("../schema/member.model");
const Definer = require ("../lib/mistake");
const assert =require("assert");
const bcrypt = require("bcryptjs");
const { shapeIntoMongooseObjectId, lookup_auth_member_following, lookup_auth_member_liked } = require("../lib/config");
const View = require("./View");
const Like = require("./Like");


class Member {
    constructor () {
        this.memberModel=MemberModel
    }
    async signupData(input) {
        try { 
            const salt = await bcrypt.genSalt();
            input.mb_password = await bcrypt.hash(input.mb_password, salt);
            const new_member =new this.memberModel(input);
            let result;
            try {
                 result = await new_member.save();

            } catch (mongo_err) {
                console.log(mongo_err);
                throw new Error (Definer.auth_err1);
            }                     
            result.mb_password= "";
            return result;
            } catch (err){
            throw(err);
        }
     }
     async loginData(input) {
        try {
            const member = await this.memberModel
            .findOne({mb_nick: input.mb_nick},{mb_nick: 1, mb_password: 1 })
            .exec();
            
            assert.ok(member,Definer.auth_err2);
            
            const isMatch = await bcrypt.compare (input.mb_password, member.mb_password);
            assert.ok(isMatch,Definer.auth_err3);
            return await this.memberModel
            .findOne({mb_nick: input.mb_nick})
            .exec();
            }catch (err){
            throw(err);
        }
     }


     async getChosenMemberData (member,id) {
        try {
            const auth_mb_id = shapeIntoMongooseObjectId(member?._id);
            id = shapeIntoMongooseObjectId(id);
            console.log("member:::", member);

            let aggregateQuery = [
                {$match: {_id: id, mb_status: "ACTIVE"}},
                {$unset: "mb_password"},
            ]

            if (member) {
                //Condition if not seen before
                await this.viewChosenItemByMember(member, id, "member");
                //to do check auth mem liked chosen target
            aggregateQuery.push(lookup_auth_member_liked(auth_mb_id))
            aggregateQuery.push(lookup_auth_member_following(auth_mb_id, "members")); 

            }

            const result = await this.memberModel
            .aggregate(aggregateQuery)
            .exec();

            assert.ok(result, Definer.general_err2);
            return result [0];

        } catch (err) {
            throw err;
        }
     }

     async viewChosenItemByMember (member, view_ref_id, group_type) {
        try { 
            view_ref_id = shapeIntoMongooseObjectId(view_ref_id);
            const mb_id = shapeIntoMongooseObjectId(member._id);

            const view = new View(mb_id);

            //Validation 
            const isValid = view.validateChosenTarget(view_ref_id, group_type);
            assert.ok(isValid,Definer.general_err2);

             //Loged USer target before
             const doesExist = await view.checkViewExistance(view_ref_id);
             console.log("doesExist:::", doesExist);

             if(!doesExist) {
             const result = await view.insertMemberView(view_ref_id, group_type);
             assert.ok(result, Definer.general_err1);
             }
             return true;

        } catch(err) {
            throw err;
        }
     }

     async likeMemberChosenItemByMember (member, like_ref_id, group_type) {
        try {
          const mb_id = shapeIntoMongooseObjectId(member._id),
          like_refer_id = shapeIntoMongooseObjectId(like_ref_id);

          const like = new Like(mb_id);
          const isValid = await like.validateTargetItem (like_refer_id, group_type);
          assert.ok(isValid, Definer.general_err2);

          const doesExist = await like.checkLikeExistance(like_refer_id);

          let data = doesExist 
          ? await like.removeMemberLike(like_refer_id,group_type)
          : await like.insertMemberLike(like_refer_id, group_type)
          assert.ok(data, Definer.general_err1);

          const result = {
            like_group: data.like_group,
            like_ref_id: data.like_ref_id,
            like_status:doesExist ? 0 : 1,
          };
          return result;

        } catch (err) {
            throw err;
        }
     }

     async updateMemberData (id, data, image) {
        try {
           const mb_id = shapeIntoMongooseObjectId(id);
           let params = {
            mb_nick: data.mb_nick,
            mb_phone: data.mb_phone,
            mb_address: data.mb_address,
            mb_description: data.mb_description,
            mb_image: image ? image.path : null ,
           };
           for (let prop in params) if (!params[prop]) delete params[prop];
           const result = await this.memberModel.findOneAndUpdate({
            _id: mb_id}, params, {
                runValidators: true,
                lean: true,
                returnDocument: "after",
            }).exec();
            assert.ok(result, Definer.general_err1);
            return result

            }catch (err){
            throw(err);
        }
     }

    }

module.exports =Member;