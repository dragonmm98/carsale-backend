const ViewModel = require("../schema/view.model");
const memberModel = require("../schema/member.model");
const productModel = require("../schema/product.model");
const boArticleModel = require("../schema/bo_article.model");

class View {
    constructor(mb_id) {
        this.ViewModel = ViewModel;
        this.memberModel = memberModel;
        this.productModel = productModel;
        this.boArticleModel = boArticleModel;
        this.mb_id = mb_id;
    }

    async validateChosenTarget (view_ref_id, group_type) {
        try {
           let result;
           switch(group_type) {
            case "member":
            result = await this.memberModel
            .findOne({
                _id: view_ref_id,
                 mb_status: "ACTIVE",
                }).exec();
                break;
                case "product":
                    result = await this.productModel
                    .findOne({
                        _id: view_ref_id,
                         product_status: "PROCESS",
                        }).exec();
                        break;
                        case "community":
                    result = await this.boArticleModel
                    .findOne({
                        _id: view_ref_id,
                         art_status: "active",
                        }).exec();
                        break;
           }
           return !!result;
        } catch (err) {
            throw err;
        }
    }

    async insertMemberView (view_ref_id, group_type) {
        try {
           const new_view = new this.ViewModel({
            mb_id: this.mb_id,
            view_ref_id: view_ref_id,
            view_group: group_type
           });

           const result = await new_view.save();
           await this.modifyItemViewCounts(view_ref_id, group_type);
           return result;
        } catch (err) {
            throw err;
        }
    }

    async modifyItemViewCounts (view_ref_id, group_type) {
        try {
            switch(group_type) {
                case "member":
                 await this.memberModel
                .findByIdAndUpdate({
                    _id: view_ref_id,
                }, {$inc: {mb_views: 1}}
                ).exec();
                    break;
                    case "product":
                        await this.productModel
                       .findByIdAndUpdate({
                           _id: view_ref_id,
                       }, {$inc: {product_views: 1}}
                       ).exec();
                           break;
                           case "community":
                            await this.boArticleModel
                           .findByIdAndUpdate({
                               _id: view_ref_id,
                           }, {$inc: {art_views: 1}}
                           ).exec();
                               break;
                }
                return true;
           
        } catch (err) {
            throw err;
        }
    }

    async checkViewExistance(view_ref_id) {
        try {
          const view = await this.ViewModel
          .findOne({
            mb_id: this.mb_id,
            view_ref_id: view_ref_id,
          })
          .exec();
          return view ? true : false ;
        } catch (err) {
            throw err;
        }
    }
}

module.exports = View;