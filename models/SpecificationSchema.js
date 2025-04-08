const mongoose = require("mongoose");

const SpecificationSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  category: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Category",
    required: true
  },
}, {timestamps: true});

module.exports = mongoose.model("Specifications", SpecificationSchema);
