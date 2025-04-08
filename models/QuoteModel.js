const mongoose = require("mongoose");


const quoteSchema = new mongoose.Schema({
    fname: {
        type: String,
        required: true
    },
    lname: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    phone: {
        type: String,
        required: true
    },
    company:{
        type: String,
        
    },
    budget: {
        type: String,
        
    },
    zip:{
       type: String,
    },
    document:{
       type: String,
    },
    message: {
        type: String,
        required: true
    },
    quoteType: {
        type: String,
        required: true,
        default: "Normal"
    }
   

},{timestamps: true});

quoteSchema.virtual("fullImageUrl").get(function () {
    return `${process.env.BACKEND_URL}/uploads/${this.image}`;
  });
  
  quoteSchema.set("toJSON", { virtuals: true });

module.exports = mongoose.model("Quote", quoteSchema);