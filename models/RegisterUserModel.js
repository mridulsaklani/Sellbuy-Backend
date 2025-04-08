const mongoose = require('mongoose');

const RegisterUserSchema = new mongoose.Schema({
    first_name:{
        type:String,
        required:true
    },
    last_name:{
        type:String,
        required:true
    },
    email:{
        type:String,
        required:true,
        unique:true
    },
    phone:{
        type:Number,
        required:true,
        unique:true
    },
    company_name:{
        type:String,
        required:true
    },
    role:{
        type:String,
        required:true
    },
    message:{
        type:String,
        required:true
    },
    

},{timestamps: true})

module.exports = mongoose.model("register", RegisterUserSchema )