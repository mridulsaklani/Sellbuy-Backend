const mongoose = require("mongoose");

const RFQSchema = new mongoose.Schema(
  {
    product:{
      type: String,
      required:true,
      trim: true,
      lowercase: true
    },
    category: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Category",
      required: true,
    },
   
    brand: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "user",
      required: true,
    },
    quantity:{
      type: Number,
      required: true,
      trim: true
    },
    fromDate:{
      type: Date,
      required: true
    },
    toDate:{
      type: Date,
      required: true
    },
    deliverySchedule:{
      type: String,
      enum: ["weekly", "monthly", "quarterly", "annually"],
      required: true
    },
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "user",
      required: true
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

    measurement:{
    type: String,
    enum:[
      "mm", "cm", "m", "inch", "feet", 
      "m²", "ft²", 
      "m³", "ft³", 
      "kg", "ton", 
      "per piece", "per bag", "per bundle", "per roll", "per sheet"
    ],

    required: true,
    lowercase: true,
    trim: true
    },
    
    DeliveryLocation: {
      type: String,
      required: true,
      trim: true,
    },
    pinCode: {
      type: Number,
      required: true,
      trim: true
    },
    comments: {
      type: String,
      required: true,
      trim: true,
    },
    document: {
      type: [
        {
          S_No: { type: Number, required: true },
          Key_parameter: { type: String, required: true },
          values: { type: Object, required: true },
        },
      ],
      required: true,
    },
    status:{
        type: Boolean,
        default: false,
    },
    process:{
       type: String,
       lowercase: true,
       enum: ['created by buyer', 'send to vendors', 'updated by admin', 'denied by buyer', 'approved by buyer' ],
       default: 'created by buyer',
       required: true
    },
    additionalComment:
        {
          type: String,
        },
       
    
  },
  { timestamps: true }
);

module.exports = mongoose.model("rfq", RFQSchema);
