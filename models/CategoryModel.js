const mongoose = require('mongoose');

const CategorySchema = new mongoose.Schema({
   category: {
    type: String,
    unique: true,
    required: true,
    trim: true
   },
   
}, {timestamps: true})

module.exports = mongoose.model("Category", CategorySchema)