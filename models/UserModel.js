const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken')


const userSchema = new mongoose.Schema({
    name: { type: String, required: true, trim: true, lowercase: true },
    email: { type: String, required: true, unique: [true, "Email is already register"], lowercase: true },
    number: {type: String, required: true},
    password: { type: String, required: true },
    refreshToken: {type: String, default: ""},
    isEmailVerify:{type: Boolean, default: false},
    isActive: {type: Boolean, default: false, required: true},
    rating:{type: Number, default: null, enum: [1, 1.5, 2, 2.5, 3, 3.5, 4, 4.5, 5]},
    location:{type: String, trim: true},
    billingName:{type: String, trim: true, lowercase: true},
    role: { type: String, enum: ["buyer", "supplier", "admin"], required: true },
    verificationOTP:{ type: Number,trim: true }
},
{ 
    discriminatorKey: "role", 
    timestamps: true 
});

userSchema.pre("save", async function(next){
    if(!this.isModified('password')) return next();
    this.password = await bcrypt.hash(this.password, 10);
    next();
})

userSchema.methods.isPasswordCorrect = async function(password){
  return await bcrypt.compare(password, this.password);
}

userSchema.methods.generateAccessToken =  function() {
    return  jwt.sign(
        {
            _id: this._id,
            name: this.name,
            role: this.role
        },
        process.env.ACCESS_TOKEN_SECRET,
        {
            expiresIn: process.env.ACCESS_TOKEN_EXPIRY
        }
)
}

userSchema.methods.generateRefreshToken = function() {
    return jwt.sign(
        {
            _id: this._id,
        },
        process.env.REFRESH_TOKEN_SECRET,
        {
            expiresIn: process.env.REFRESH_TOKEN_EXPIRY
        }
)
}

module.exports = mongoose.model('user', userSchema);