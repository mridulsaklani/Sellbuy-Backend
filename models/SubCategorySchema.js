const mongoose = require('mongoose');

const SubCategorySchema = new mongoose.Schema({
    name:{
        type: String,
        required: true,
        trim: true
    },
    categoryId:{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Category', 
        required: true,
    },
    isActive:{
        type: Boolean,
        default: true
    }
},{timestamps: true})

module.exports = mongoose.model('SubCategories', SubCategorySchema)