const mongoose = require("mongoose");

const BRFQSchema = new mongoose.Schema({
    rfqId :{
       type: mongoose.Schema.Types.ObjectId,
       ref:"rfq",
       required: true,
    },

    assigned:{
       type: Boolean,
       default: false
    },
    
    status:{
        type: Boolean,
        default: false,
    },


}, {timestamps: true});

module.exports = mongoose.model("brfq", BRFQSchema);