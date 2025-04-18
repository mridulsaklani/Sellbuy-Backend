const userSchema = require("../models/UserModel");

const verifyOTP = async (req, res) => {
    try {
        const { otp } = req.body;

        if (!otp) {
            return res.status(400).json({ success: false, message: "OTP field not found" });
        }

        const user = await userSchema.findOne({ verificationOTP: otp });

        if (!user) {
            return res.status(400).json({ message: "user is not valid" });
        }

        
        if (String(user.verificationOTP) !== String(otp)) {
            console.log("Provided OTP:", otp);
            console.log("User from DB:", user);
            return res.status(400).json({ message: "OTP is not valid" });
        }

        user.verificationOTP = null;
        await user.save();

        res.status(200).json({ message: "You are authorized" });

    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Internal server error" });
    }
};

module.exports = {
    verifyOTP,
};
