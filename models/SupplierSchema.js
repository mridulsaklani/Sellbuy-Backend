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
    branchDetail: [{
        gstNumber: {
          type: String,
          trim: true,
        },
        state: {
          type: String,
          trim: true,
        },
        address: {
          type: String,
          trim: true,
        }
      },]
      
    
})

module.exports = User.discriminator("supplier", supplierSchema)