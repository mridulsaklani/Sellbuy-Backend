const mongoose = require("mongoose")


const orderSchema = new mongoose.Schema({
   vrfqId:{
     type: mongoose.Schema.Types.ObjectId,
     ref: "vrfq",
     required: true
   },
   supplier:{
    type: mongoose.Schema.Types.ObjectId,
    ref:"user",
    required:true
   },
   buyer:{
    type: mongoose.Schema.Types.ObjectId,
    ref:"user",
    required: true
   },
   status:{
      type: Boolean,
      default: false
   },
   process:{
      type: String,
      enum: ["confirmed", "processing", "dispatch", "shipped", "delivered" , "canceled"],
      default: "confirmed",
   }


}, {timestamps: true});

module.exports = mongoose.model('order', orderSchema);