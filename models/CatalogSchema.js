const mongoose = require("mongoose");

const CatalogSchema = new mongoose.Schema({
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
  createdBy: {
    type: String,
    required: true,
    enum: ["Admin", "Supplier"],
    trim: true
  },
},{timestamps: true});

module.exports = mongoose.model("Catalog", CatalogSchema);