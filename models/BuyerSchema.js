const mongoose = require("mongoose");
const User = require("../models/UserModel");

const BuyerSchema = new mongoose.Schema({
  company: { type: String, required: true, lowercase: true, trim: true },
  
  category: {
    type: String,
    required: true,
    enum: [
      "construction company",
      "sme",
      "property developers",
      "architects",
      "engineers",
      "contractor",
    ],
    trim: true,
    lowercase: true,
  },
  tradeNumber: { type: String, required: true, trim: true },
  website: {
    type: String,
    trim: true,
    lowercase: true
  },
});

const Buyer = User.discriminator("buyer", BuyerSchema);
module.exports = Buyer;
