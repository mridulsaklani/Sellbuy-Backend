const UserSchema = require("../models/UserModel");
const mongoose = require("mongoose")
const BuyerSchema = require('../models/BuyerSchema');
const SupplierSchema = require('../models/SupplierSchema');
const JWT = require("jsonwebtoken")


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
        res.status(500).json({message: "Internal server error"})
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
        const response = await UserSchema.find({role: {$eq: "buyer"}}).select("-password -refreshToken").lean();
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
        const response = await UserSchema.find({role: {$eq: "supplier"}}).select("-password -refreshToken").lean();
        if(!response) res.status(404).json({message: "Not Found"});
        res.status(200).json({message: "Supplier user get successfully", user: response});
    } catch (error) {
        console.error(error);
        res.status(500).json({message: "Internal server error"});
    }
}

// Add User 

const addUser = async(req, res)=>{
    try {

        const {name, email, number, password, role, ...rest} = req.body;

        if(!name || !email || !number || !password || !role) return res.status(400).json({message: "Fields are required"});

        // checking user already register 

        const userExist = await UserSchema.findOne({email});
        console.log('user exist', userExist);
        if(userExist) return res.status(400).json({message: "User already exist, please check your email!"});

        // checking close

        let user;
        if(role === "buyer") {
            user = new BuyerSchema({name, email, number, password, role, ...rest}); 
        }
        else if(role === "supplier"){
            user = new SupplierSchema({name, email, number, password, role, ...rest});
        }
        else{
            return res.status(400).json({message: "Invalid role"});
        }

        await user.save();

        res.status(201).json({
            message: "user created successfully",
        })
        
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

        if(!user) return res.status(400).json({message: "User not exist"});

        const isPasswordValid = await user.isPasswordCorrect(password);
        if(!isPasswordValid) return res.status(401).json({message: "Incorrect password"});

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
            LoggedAccessToken: accessToken,
            LoggedRefreshToken: refreshToken
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
                $set: {refreshToken: undefined}
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
        const {oldPassword, newPassword} = req.body;

        if(!oldPassword || !newPassword) return res.status(400).json({message: "Fields are required"});

        const user = await UserSchema.findById(req.user._id);

        if(!user) return res.status(400).json({message: "User not found"});

        const isPasswordCorrect = await user.isPasswordCorrect(oldPassword);

        if(!isPasswordCorrect) return res.status(400).json({message: "Old password is Incorrect"});
        user.password = newPassword;

        await user.save({validateBeforeSave: false});


    } catch (error) {
        console.error(error);
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
    loginUser,
    logoutUser,
    getUser,
    refreshAccessToken,
    changePassword,
    deleteUser,
}