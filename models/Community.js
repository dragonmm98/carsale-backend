
const BoArticleModel = require("../schema/bo_article.model");
const Definer = require ("../lib/mistake"); 
const assert =require("assert");
const { shapeIntoMongooseObjectId, board_id_enums_list } = require("../lib/config");
const View = require("./View");
const Member = require("./Member");


class Community {
    constructor () {
        this.boArticleModel=BoArticleModel;
    }
     async createArticleData(member,data) {
        try {
        data.mb_id = shapeIntoMongooseObjectId(member._id);
        const new_article = await this.saveArticleData(data);
        return new_article;
                                 

            } catch (err){
            throw err;
        }
     }
      
     async saveArticleData(data) {
        try {
         const article = new this.boArticleModel(data);
         return await article.save();
        } catch (mongo_err) {
            throw new Error (Definer.auth_err1)
        }
     }
   
       
     async getMemberArticlesData (member, mbid, inquery, ) {
        try {
        const auth_mb_id = shapeIntoMongooseObjectId(member?._id),
         mb_id = shapeIntoMongooseObjectId(mbid),
         page = inquery["page"] ? inquery["page"] *1 : 1,
         limit = inquery["limit"] ? inquery["limit"] *1 :5;

    const result = await this.boArticleModel.aggregate([
        {$match: {mb_id: mb_id, art_status: "active"}},
        {$sort: {createdAt: -1}},
        {$skip: (page-1) * limit},
        {$limit : limit},
        {$lookup: {
            from:"members",
            localField: "mb_id",
            foreignField:"_id",
            as: "members_data",
        }}, {$unwind: "$members_data"},
    ]).exec();

    assert.ok(result, Definer.article_err2);


    return result;    
    } catch (err) {
        throw err;
    }
}

async getArticlesData (member, querydata) {
    try{
        const auth_mb_id = shapeIntoMongooseObjectId(member._id);
        let matches = 
        querydata.bo_id === "all" ? {
            bo_id : {$in: board_id_enums_list}, art_status: "active"}
            : {bo_id: querydata.bo_id, art_status: "active"};
        querydata.limit *= 1;
        querydata.page *= 1;

        const sort = querydata.order ? {[`${querydata.order}`]: -1} : {createdAt: -1};

        const result = await this.boArticleModel.aggregate([
            {$match: matches},
            {$sort: sort},
            {$skip: (querydata.page -1 )* querydata.limit},
            {$limit: querydata.limit},
            {$lookup: {
                from:"members",
                localField: "mb_id",
                foreignField:"_id",
                as: "members_data",
            }}, {$unwind: "$members_data"},
            //to do member like
        ]).exec();
      assert.ok(result, Definer.article_err3)

   return result;
    } catch (err) {
        throw err;
    }
}

async getChosenArticleData (member, art_id) {
    try {
        art_id = shapeIntoMongooseObjectId(art_id);
        if (member) {
            const member_obj = new Member();
            await member_obj.viewChosenItemByMember(member, art_id, "community");
        }
        const result = await this.boArticleModel.findById({_id: art_id}).exec();
        assert.ok(result,Definer.article_err3);
      return result;
    } catch (err) {
        throw err;
    }
}

}

     module.exports = Community;