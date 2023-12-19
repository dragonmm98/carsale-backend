const memberModel = require("../schema/member.model");
const productModel = require("../schema/product.model");
const boArticleModel = require("../schema/bo_article.model");
const likeModel = require ("../schema/like.model");
const Definer = require ("../lib/mistake");
const assert =require("assert");
const bcrypt = require("bcryptjs");
const { shapeIntoMongooseObjectId, lookup_auth_member_following } = require("../lib/config");

class Like {
    constructor (mb_id) {
        this.likeModel = likeModel;
        this.memberModel = memberModel;
        this.productModel = productModel;
        this.boArticleModel = boArticleModel;
        this.mb_id = mb_id; 
    }
    async validateTargetItem (like_ref_id, group_type) {
        try {
           let result;
           switch(group_type) {
            case "member":
            result = await this.memberModel
            .findOne({
                _id: like_ref_id,
                 mb_status: "ACTIVE",
                }).exec();
                break;
                case "product":
                    result = await this.productModel
                    .findOne({
                        _id: like_ref_id,
                         product_status: "PROCESS",
                        }).exec();
                        break;
                        case "community":
                    result = await this.boArticleModel
                    .findOne({
                        _id: like_ref_id,
                         art_status: "active",
                        }).exec();
                        break;
           }
           return !!result;
        } catch (err) {
            throw err;
        }
    }

    async checkLikeExistance (like_ref_id) {
        try {
         const like = await this.likeModel.findOne({
            mb_id: this.mb_id, like_ref_id: like_ref_id,})
            .exec();

            return !!like; 
        } catch (err) {
            throw err;
        }
    }

    async removeMemberLike (like_ref_id, group_type) {
        try{
        const result = await this.likeModel.findOneAndDelete({
           like_ref_id: like_ref_id,
           mb_id: this.mb_id
        }).exec();
         await this.modifyItemLikeCounts(like_ref_id,group_type, -1);
         return result;
        } catch (err) {
            throw err;
        }
    } 

    
    async insertMemberLike (like_ref_id, group_type) {
        try{
         const new_like = new this.likeModel ({
            mb_id: this.mb_id,
            like_ref_id: like_ref_id,
            like_group: group_type,
         });
         const result = await new_like.save();

         //Modify target likes count
         await this.modifyItemLikeCounts(like_ref_id,group_type, 1);
         return result;
        } catch (err) {
            throw new Error(Definer.auth_err1);
        }
    } 


    async modifyItemLikeCounts (like_ref_id, group_type, modifier) {
      try {
        switch(group_type) {
            case "member":
             await this.memberModel
            .findByIdAndUpdate({
                _id: like_ref_id,
            }, {$inc: {mb_likes: modifier}}
            ).exec();
                break;
                case "product":
                    await this.productModel
                   .findByIdAndUpdate({
                       _id: like_ref_id,
                   }, {$inc: {product_likes: modifier}}
                   ).exec();
                       break;
                       case "community":
                        await this.boArticleModel
                       .findByIdAndUpdate({
                           _id: like_ref_id,
                       }, {$inc: {art_likes: modifier}}
                       ).exec();
                           break;
            }
            return true;
      } catch (err) {
        throw err;
      }

    }
}

module.exports = Like;