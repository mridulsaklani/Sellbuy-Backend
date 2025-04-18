const userSchema = require("../models/UserModel");

const authController = async (req, res) => {
    try {
         const user = req.user;

         if(!user) return res.status(400).json({message: "User not found"});
         
         const mainUser = await userSchema.findById(user._id).select("-password -refreshToken");
         if(!mainUser) return res.status(400).json({message: "Main user not found"});

         mainUser.isActive = true;

         await mainUser.save({validateBeforeSave: false});

        return res.status(200).json({ isAuthenticated: true, user: mainUser});
    } catch (error) {
        console.error("Auth Controller Error:", error);
        res.status(500).json({ message: "Error from auth controller" });
    }
};

module.exports = authController;
