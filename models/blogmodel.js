const mongoose = require('mongoose');

const blogSchema = mongoose.Schema({
    userId:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'registers',
        required:true

    },
    title:{
        type:String,
        required:true
    },
    content:
    {
        type:String,
        required:true
    },
    image:
    {
        type:String,
        required:true
    },
    category:
    {
        type:String,
        required:true
    },
    createdAt: { 
        type: Date, 
        default: Date.now 
    },
    updatedAt: { 
        type: Date, 
        default: Date.now 
    }
},{timestamps:true})

const blogModel = mongoose.model("posts",blogSchema)

module.exports = blogModel