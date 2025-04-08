const mongoose = require('mongoose');
const User = require('../models/UserModel')


const supplierSchema = new mongoose.Schema({
    company:{
        type: String,
        required: true,
        trim: true,
        lowercase: true
    },
    category:{
        type: String,
        required: true,
        enum:["material supplier", "service provider", "transporter", "machine rentals", "waste management", "interior"]
    },
    
})

module.exports = User.discriminator("supplier", supplierSchema)