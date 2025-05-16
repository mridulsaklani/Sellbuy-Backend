const mongoose = require("mongoose");

const VRFQSchema = new mongoose.Schema({
    brfqId: {
        type: mongoose.Schema.Types.ObjectId,
        ref:"brfq",
        required: true
    },
    createdBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "user",
        required: true
    },
    spreadQuantityData:[{
        quantity:{type: Number},
        fromDate:{type: Date},
        toDate:{type: Date},
        location:{type: String}
    }],
    process:{
        type: String,
        enum:["created by vendor", 'rejected by admin', "negotiate", "updated by vendor", 'approved by admin'],
        default: "created by vendor"
    },
    status:{
       type: Boolean,
       default: false,
    },
    TotalPrice:[{
        pricePerUnit:{
            type: Number,
            default: null
        },
        totalUnit:{
            type: Number,
            default: null
        },
        product:{
            type:mongoose.Schema.Types.ObjectId,
            ref:"Catalog",
            default: null
        },
        gst:{
            type: Number,
            default: null
        },
        total:{
            type: Number,
            default: null
        },
        finalPrice: {
            type: Number,
            default: null
        }
}],
    additionalComment:{
        type: String,
        trim: true
    }
    
   
},{timestamps:true})

module.exports = mongoose.model("vrfq", VRFQSchema)