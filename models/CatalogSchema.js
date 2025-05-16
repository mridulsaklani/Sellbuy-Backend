const mongoose = require("mongoose");

const CatalogSchema = new mongoose.Schema({
  productName:{
     type: String,
     required: true,
     lowercase: true,
     trim: true
  },
  category: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Category",
    required: true,
  },
  subCategory: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "SubCategories",
    required: true,
  },
  seller: { type: mongoose.Schema.Types.ObjectId, ref: "user", required: true },
  iso: { type: String, enum: ["yes", "no"], required: true, trim: true, lowerCase: true },
  specifications: [
    {
      key: { type: mongoose.Schema.Types.ObjectId, ref: "Specifications", required: true },
      value: { type: String,
        default: "N/A",
        trim: true},
    },
  ],
  
  addSpecifications:[
    {
      field: {
        type: String,
        trim: true,
        lowerCase: true
      },
      value:{
        type: String,
        trim: true,
        lowerCase: true
      }
    }
  ] ,

  paymentSchedule:{
    advance:{
      type: Number,
      required: true
      
    },
    afterDispatch:{
      type: Number,
      required: true
    },
    onDelivery:{
      type: Number,
      required: true
    },
    afterTesting:{
      type: Number,
      required: true
    }
  },

  commercialCondition:{
    productPrice:{
      type: Number,
      required: true
    },
    priceValidity:{
      type: Date,
      required: true
    },
    productDiscount:{
      type: Number,
      required: true
    },
    discountValidity:{
      type: Date,
      required: true
    },
    productUnit:{
      type: String,
      enum:[
        "mm", "cm", "m", "inch", "feet", 
        "m²", "ft²", 
        "m³", "ft³", 
        "kg", "ton", 
        "per piece", "per bag", "per bundle", "per roll", "per sheet"
      ],
      trim: true
    }
  },

  condition:{
    type: String,
    required: true
  },

  finalPrice:{
    type: Number,
    default: 0
  },

  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'user',
    required: true,
  },

},{timestamps: true});

CatalogSchema.pre("save", async function(next){
   const price = Math.floor(this.commercialCondition.productPrice - (this.commercialCondition.productPrice * (this.commercialCondition.productDiscount / 100)))
   this.finalPrice = price;
   next()
})

CatalogSchema.methods.calculateFinalPrice = async function(price, discount, session) {
  this.finalPrice = Math.floor(price - (price * (discount / 100)));
  await this.save({ session }); 
  return true
};

module.exports = mongoose.model("Catalog", CatalogSchema);