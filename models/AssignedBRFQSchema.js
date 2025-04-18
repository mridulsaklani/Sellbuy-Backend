const mongoose = require('mongoose');

const AssignedBRFQSchema = new mongoose.Schema({
     brfqId: {
      type:  mongoose.Schema.Types.ObjectId,
      ref:"brfq",
      required: true
     },
     supplierId: [
          {type: mongoose.Schema.Types.ObjectId, ref:"user", required: true}
     ],
     process:{
          type: String,
          enum: ["reviewing by buyer", "send to suppliers", "accepted"],
          default: "send to suppliers"
     },
     status:{
          type: Boolean,
          default: false
     }
     
}, {timestamps: true});

module.exports = mongoose.model("assignedbrfq", AssignedBRFQSchema)