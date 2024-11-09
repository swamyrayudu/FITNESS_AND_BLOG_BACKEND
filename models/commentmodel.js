const mongoose = require('mongoose');

const commentSchema = mongoose.Schema({
    comment:{
        type:String,
        required:true
    },
    postId:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'posts',
        required:true
    },
    userId:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'registers',
        required:true
    }
},{timestamps:true})

const commentmodel = mongoose.model("comments",commentSchema)

module.exports = commentmodel;