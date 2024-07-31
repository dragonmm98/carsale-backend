const mongoose = require("mongoose");
const { comment_type, board_article_status } = require("../lib/config");
const Schema = mongoose.Schema;

const commentSchema = new mongoose.Schema (
    {
    mb_id: {type: Schema.Types.ObjectId, ref: "Member", required: true},
    comment_types: {
        type: String,
        required: true,
        enum: {
            values: comment_type,
        },
    },
    comment_description: {
        type: String,
        required: true,},

        comment_status:{type:String, required: false, default: "active", enum: {
            values: board_article_status,
            message: "{VALUE} is not among permitted values",
           } },
}, {timestamps: {createdAt: true }}
);
module.exports = mongoose.model("Comment", commentSchema); 