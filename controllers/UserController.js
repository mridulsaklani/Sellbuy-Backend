const UserSchema = require("../models/UserModel");
const mongoose = require("mongoose")
const BuyerSchema = require('../models/BuyerSchema');
const SupplierSchema = require('../models/SupplierSchema');
const JWT = require("jsonwebtoken");

const {sendWelcomeMail, sendUserVerificationMail} = require('../utils/mailer');
const { options } = require("../routes/UserRouter");


// Generate Verify OTP
const generateVerificationOTP =()=>{
  return  Math.floor(100000 + Math.random() * 900000).toString();
} 


const generateAccessAndRefreshToken = async(userId)=>{
    try{
    const user = await UserSchema.findById(userId);

    const accessToken = await user.generateAccessToken();
    const refreshToken = await user.generateRefreshToken();

    user.refreshToken = refreshToken;
    await user.save({validateBeforeSave: false});
   
    return {accessToken, refreshToken};

    }catch(err){
        console.error(err)
        
    }
}

// Get User 

const getUser = async(req,res)=>{
    try {
        const response = await UserSchema.find({}).lean();
        if(!response) return res.status(404).json({message: "Not found"});
        res.status(200).json(response)
    } catch (error) {
        console.error(error);
        res.status(500).json({message: "Internal server error"});
    }
}

// Get single user

const getSingleUser = async(req,res)=>{

    try {

        const id = req.user?._id;

        if(!mongoose.Types.ObjectId.isValid(id)) return res.status(400).json({message: "Invalid mongoose ID"});

        const user = await UserSchema.findById(id).select("-password -refreshToken").lean();
        if(!user) return res.status(404).json({message: "User not found"});

        res.status(200).json({
            message: "User fetch successfully",
            user,
        });

    } catch (error) {
        console.error(error);
        res.status(500).json({message: "Internal server error"});
    }
}

// Get Buyer

const buyerUser = async (req,res)=>{
    try {
        const response = await UserSchema.find({role: {$eq: "buyer"}}).select("-password -refreshToken").sort({createdAt: -1}).lean();
        if(!response) res.status(404).json({message: "Not found"});
        res.status(200).json({message: "Buyer user get successfully", user: response});
    } catch (error) {
        console.error(error);
        res.status(500).json({message: "Internal server error"})
    }
}

// Get Supplier

const supplierUser = async(req, res)=>{
    try {
        const response = await UserSchema.find({role: {$eq: "supplier"}}).select("-password -refreshToken").sort({createdAt: -1}).lean();
        if(!response) res.status(404).json({message: "Not Found"});
        res.status(200).json({message: "Supplier user get successfully", user: response});
    } catch (error) {
        console.error(error);
        res.status(500).json({message: "Internal server error"});
    }
}

// Count User

const getUsersQuantity = async (req, res) => {
    try {
        const result = await UserSchema.aggregate([
            {
                $group: {
                    _id: "$role",
                    count: { $sum: 1 }
                }
            }
        ]);

        const response = {
            buyerCount: 0,
            supplierCount: 0
        };

        result.forEach(roleGroup => {
            if (roleGroup._id === 'buyer') {
                response.buyerCount = roleGroup.count;
            } else if (roleGroup._id === 'supplier') {
                response.supplierCount = roleGroup.count;
            }
        });

        res.status(200).json(response);

    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Internal server error" });
    }
};


// Add User 

const addUser = async(req, res)=>{
    try {

        const {name, email, number, password, role, ...rest} = req.body;

        if(!name || !email || !number || !password || !role) return res.status(400).json({message: "Fields are required"});
 

        const userExist = await UserSchema.findOne({email});
        if(userExist) return res.status(400).json({message: "User already exist, please use different email!"});

        const verificationOTP = generateVerificationOTP();
        
        let user;
        if(role === "buyer") {
            user = new BuyerSchema({name, email, number, password, role, verificationOTP, ...rest}); 
        }
        else if(role === "supplier"){
            user = new SupplierSchema({name, email, number, password, role, verificationOTP, ...rest});
        }
        else{
            return res.status(400).json({message: "Invalid role"});
        }

        await user.save();

        await sendWelcomeMail(email, name, verificationOTP);


        res.status(201).json({
            message: "user created successfully",
        })
        
    } catch (error) {
        console.error(error);
        res.status(500).json({message: "Internal server error"})
    }
}


// Verify OTP

const verifyOTP = async (req, res) => {
    try {
        const { otp, emailForVerification } = req.body;

        if (!otp, !emailForVerification) {
            return res.status(400).json({ success: false, message: "OTP field and verification email not found" });
        }        

        const user = await UserSchema.findOne({ email: emailForVerification });

        if (!user) {
            return res.status(400).json({ message: "user is not valid" });
        }

        
        if (String(user.verificationOTP) !== String(otp)) {
            return res.status(400).json({ message: "OTP is not valid" });
        }

        user.verificationOTP = null;
        user.isEmailVerify = true
        await user.save();

        res.status(200).json({ message: "You are authorized" });

    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Internal server error" });
    }
};


// Verify OTP for forget password user to Reset password

const verifyOTPForgetPassword = async(req,res)=>{
    try {
        const {otp, emailForVerification} = req.body;
        if (!otp, !emailForVerification) {
            return res.status(400).json({ success: false, message: "OTP field and verification email not found" });
        }        

        const user = await UserSchema.findOne({ email: emailForVerification });

        if (!user) {
            return res.status(400).json({ message: "user is not valid" });
        }

        
        if (String(user.verificationOTP) !== String(otp)) {
            return res.status(400).json({ message: "OTP is not valid" });
        }

        const {accessToken , refreshToken } = await generateAccessAndRefreshToken(user._id);``

        user.verificationOTP = null;
        
        await user.save();
        const User = await UserSchema.findById(user._id).select("-password -refreshToken");

        const option = {
            httpOnly: true, 
            secure: true,
            sameSite: "None",
        }

       return res.status(200).cookie("accessToken", accessToken, option).cookie("refreshToken", refreshToken, option).json({ message: "You are authorized", user: User });


    } catch (error) {
        console.error(error);
        res.status(500).json({message: "Internal server error"})
    }
}

// Login User

const loginUser = async(req, res)=>{
    try {
        const {email, password} = req.body;

        if(!email || !password) return res.status(400).json({message: "Email or password fields are required"});
        
        const user = await UserSchema.findOne({email});

        if(!user) return res.status(400).json({message: "Incorrect email"});

        if(user.isEmailVerify !== true){
            let {name, verificationOTP} = user;

            if(!verificationOTP){
                verificationOTP = generateVerificationOTP()
                user.verificationOTP = verificationOTP
                await user.save();
            }
            
            await sendWelcomeMail(email,name,verificationOTP);
            return res.status(401).json({success: false, message: "Email is not verified, otp resend, please verify otp first"});
        }

        const isPasswordValid = await user.isPasswordCorrect(password);
        if(!isPasswordValid) return res.status(400).json({message: "Incorrect password"});

        const {accessToken, refreshToken} = await generateAccessAndRefreshToken(user._id);

        const loggedInUser = await UserSchema.findById(user._id).select("-password -refreshToken");

        const option = {
            httpOnly: true, 
            secure: true,
            sameSite: "None",
        }

        return res.status(200).cookie("accessToken", accessToken, option).cookie("refreshToken", refreshToken , option).json({
            message: "User logged In successfully",
            user: loggedInUser,
            
        })
        
        
    } catch (error) {
        console.error(error);
        res.status(500).json({message: "Internal server error"});
    }
}



// Logout User

const logoutUser = async(req, res)=>{
    try {
        await UserSchema.findByIdAndUpdate(req.user?._id,
            {
                $set: {refreshToken: undefined, isActive: false}
            },
            {
                new: true
            }
        );
        
        const option = {
            httpOnly: true, 
            secure: true,
        }

        res.status(200).clearCookie("accessToken", option).clearCookie("refreshToken", option).json({
            message: "User log out successfully"
        });

    } catch (error) {
        console.error(error);
        res.status(500).json({message: "Internal server error"});
    }
}


// Refresh Access Token

const refreshAccessToken = async(req, res)=>{
    try {
        const incomingRefreshToken = req.cookies?.refreshToken;
        
        if(!incomingRefreshToken) return res.status(401).json({message: "Unauthorized Request"});

        const decodedToken = JWT.verify(incomingRefreshToken, process.env.REFRESH_TOKEN_SECRET);

        const user = await UserSchema.findById(decodedToken?._id);

        if(!user) return res.status(401).json({message: "Invalid refresh token"});

        if(user.refreshToken !== incomingRefreshToken) return res.status(401).json({message: "Unauthorized User "});

       const {accessToken, refreshToken} = await generateAccessAndRefreshToken(user._id);

       const option = {
        httpOnly: true,
        secure: true
       }

       res.status(200).cookie("accessToken", accessToken, option).cookie("refreshToken", refreshToken, option).json({message: "Refresh token set successfully"})
        

    } catch (error) {
        console.error(error);
        res.status(500).json({message: "Internal server error"})
    }
}


// Change Password

const changePassword = async (req ,res)=>{
    try {
        const id = req.user._id;

        if(!mongoose.Types.ObjectId.isValid(id)) return res.status(400).json({message: "Unauthorized mongoose user Id"})

        const {oldPassword, newPassword} = req.body;

        if(!oldPassword || !newPassword) return res.status(400).json({message: "Fields are required"});

        const user = await UserSchema.findById(id);

        if(!user) return res.status(400).json({message: "User not found"});

        const isPasswordCorrect = await user.isPasswordCorrect(oldPassword);

        if(!isPasswordCorrect) return res.status(400).json({message: "Old password is Incorrect"});
        user.password = newPassword;

        await user.save({validateBeforeSave: false});

        res.status(200).json({message: 'Password is changed successfully'})


    } catch (error) {
        console.error(error);
        res.status(500).json({message: "Internal server error"})
    }
}

// Update User 



const updateUser = async (req, res) => {
  try {
    const id = req.user?._id;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ message: "Invalid mongoose Id" });
    }

    const user = await UserSchema.findById(id);
    if (!user) return res.status(404).json({ message: "User not found" });

    const {
      name,
      email,
      number,
      rating,
      location,
      billingName,
      company,
      category,
      branchDetail
    } = req.body;

    
    let Model = UserSchema;
    if (user.role === 'supplier') {
      Model = SupplierSchema;
    } else if (user.role === 'buyer') {
      Model = BuyerSchema; 
    }

    const updateFields = {
      name,
      email,
      number,
      rating,
      location,
      
     
    };

    if (user.role === 'supplier') {
      updateFields.company = company;
      updateFields.category = category;
      updateFields.branchDetail = branchDetail;
      updateFields.billingName = billingName
    }

    if (user.role === 'buyer') {
      updateFields.company = company;
      updateFields.category = category;
      updateFields.billingName = billingName
    }
    

    const updatedUser = await Model.findByIdAndUpdate(
      id,
      { $set: updateFields },
      { new: true, runValidators: true }
    );

    if (!updatedUser) {
      return res.status(400).json({ message: "User not updated" });
    }

    res.status(200).json({
      message: "User updated successfully",
      user: updatedUser
    });

  } catch (error) {
    console.error("Update error:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

// User Verification for Forget password

const userVerificationForgotPassword = async(req, res)=>{
   try {
    const {email} = req.body;
    
    if(!email) return res.status(404).json({message: "Email address not found"})
    
    const isUserExist =  await UserSchema.findOne({email: email})

    if(!isUserExist) return res.status(401).json({message: "User is not register"})

    const otp =  Number(generateVerificationOTP())

    isUserExist.verificationOTP = otp

    await isUserExist.save()

    const sendMail =  await sendUserVerificationMail(email, otp)

    console.log(sendMail)

    return res.status(200).json({message:`verification mail send successfully on ${email}`})

   } catch (error) {
    console.log(error);
    res.status(500).json({message: "Internal server error"})
   }
}

const changePasswordForget = async(req, res)=>{
    try {
        const id = req.user._id
        const {password} = req.body;

        if(!mongoose.Types.ObjectId.isValid(id)) return res.status(401).json({message: "Invalid mongoose user"})
        
        if(!password) return res.status(400).json({message: "Data is missing"})

        const user = await UserSchema.findById(id)

        if(!user) return res.status(404).json({message: "User not found"})

        user.password = password;

        await user.save({validateBeforeSave: false});
        
        const role = user.role

        return res.status(200).json({message: "password changed successfully", userRole: role})


    } catch (error) {
        console.error(error)
        res.status(500).json({message: "Internal server error"})
    }
}


// Delete User

const deleteUser = async(req,res)=>{
    try{
    const {id} = req.params

    if(!mongoose.Types.ObjectId.isValid(id)) return res.status(404).json({message: "Invalid Id"});
    const response = await UserSchema.findByIdAndDelete(id);
    if(!response) return res.status(400).json({message: "User not deleted"});
    res.status(200).json({message: "User delete successfully"});
    }
    catch(error){
        console.error(error);
        res.status(500).json({message: "Internal server error"});
    }


}

module.exports = {
    addUser,
    getSingleUser,
    buyerUser,
    supplierUser,
    getUsersQuantity,
    verifyOTP,
    loginUser,
    logoutUser,
    getUser,
    refreshAccessToken,
    updateUser,
    changePassword,
    userVerificationForgotPassword,
    verifyOTPForgetPassword,
    deleteUser,
    changePasswordForget
}