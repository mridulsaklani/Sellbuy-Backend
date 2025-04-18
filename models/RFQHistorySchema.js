const mongoose = require('mongoose');
const RFQHistorySchema = new mongoose.Schema({
      rfqId:{
        type: mongoose.Schema.Types.ObjectId,
        ref:"rfq",
        required: true,
      },
      process:{
        type: String,
        lowercase: true,
        enum: ['created by buyer', 'send to vendors', 'updated by admin', 'denied by buyer', 'approved by buyer' ],
     },
     additionalComment:{
        type: String,
        trim: true
     },
     DeliveryLocation:{
      type: String,
      trim: true,
     },
     pinCode: {
      type: Number,
      trim: true
     },
     spreadQuantityData:[
      {
         quantity:{
          type: Number,
          
          trim: true
         },
         fromDate:{
          type: Date,
          
         },
         toDate:{
          type: Date,
         
         },
         location:{
          type: String,
          trim: true
         }
      },
    ],
},{timestamps: true});

module.exports = mongoose.model('RFQHistory', RFQHistorySchema);