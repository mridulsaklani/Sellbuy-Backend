const mongoose = require('mongoose');

const FAQSchema = new mongoose.Schema({
    question:{
        type: String,
        required: true
    },
    answer:{
        type: String,
        required: true  
    },
    createdAt: {
        type: Date,
        default: Date.now
    },
    isActive: {
        type: Boolean,
        default: true   
    },
    tags:{
        type: [String],
        default: []
    },
    createdAt:{
       type: Date,
       default: Date.now
    }
})

module.exports = mongoose.model('FAQ', FAQSchema)