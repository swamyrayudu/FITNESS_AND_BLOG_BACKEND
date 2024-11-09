const mongoose = require('mongoose');

const userSchems = mongoose.Schema({
    name:{
        type:String,
        required:true
    },
    email:{
        type:String,
        required:true
    },
    password:{
        type:String,
        required:true,
    },
    age:{
        type:Number,
        required:true,
    }
},{timestamps:true})


const usermodel = mongoose.model('registers',userSchems)


module.exports = usermodel