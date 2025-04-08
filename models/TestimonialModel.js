const mongoose = require('mongoose');

const TestimonialSchema = new mongoose.Schema({

    name:{
        type: String,
        required: true
    },
    designation:{
        type: String,
        required: true
    },
    data:{
        type: String,
        required:true
    },
    rating:{
        type:Number,
        required: true
    },
    images:{
        type:String,
        required: true
    },
    createdAt:{
        type: Date,
        default: Date.now
    }

})

module.exports = mongoose.model("testimonial", TestimonialSchema)
