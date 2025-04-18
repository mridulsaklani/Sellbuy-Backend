const jwt = require('jsonwebtoken');
const userSchema = require("../models/UserModel");

const verifyJWT = async(req, res, next)=>{
    try {
        const token = req.cookies?.accessToken;

        if(!token) return res.status(401).json({message: "Unauthorized"});

        const verifyToken = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);

        if(!verifyToken) return res.status(400).json({message: "JWT not verify"})

        const user = await userSchema.findById(verifyToken._id).select("-password -refreshToken");

        if (!["admin", "buyer", "supplier"].includes(user.role)) {
            return res.status(403).json({ message: "Access Denied" });
        }

        req.user = user;
        
        next();

    } catch (error) {
        console.log(error)
        res.status(401).json("Invalid access token");
    }
}

module.exports = verifyJWT;