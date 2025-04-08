const AdminContactSchema = require('../models/AdminContactSchema')
const mongoose = require('mongoose')


const getContactData = async(req,res)=>{
    try {
        const response = await AdminContactSchema.find({}).sort({createdAt: -1});
        if(!response) return res.status(404).json({message:"Data not founded"});
        res.status(200).json(response);
    } catch (error) {
        console.log(error);
        res.status(500).json({message: "Internal Server Error"});
    }
}

const getActiveContactData = async(req,res)=>{
    try {
        const response = await AdminContactSchema.find({isActive: true});
        if(!response) return res.status(404).json({message: "Not have Contact data"});
        res.status(200).json(response);
    } catch (error) {
        console.error(error)
        res.status(500).json({message: "Internal server error"});
    }
}


const setActive = async(req,res)=>{
    try {
        const id = req?.params?.id

        if(!mongoose.Types.ObjectId.isValid(id)) return res.status(400).json({message: "Not valid mongo ID"});

        await AdminContactSchema.updateMany({}, {$set: {isActive: false}})
        const response = await AdminContactSchema.findByIdAndUpdate(id, {$set: {isActive: true}});
        if(!response) return res.status(400).json({message: "Active not updated"})
        res.status(200).json({message: 'Set active Successfully'})

    } catch (error) {
        console.error(error);
        res.status(500).json({message:"Internal server error"})
    }
}


const PostContactData = async(req,res)=>{
    try {
        const {email, number, location} = req.body;
        if(!email || !number || !location) return res.status(400).json({message: "Please check your data"});

        const response = await AdminContactSchema.create({email, number, location});
        if(!response) return res.status(400).json({message: "Admin contact data not saved in db"});

        res.status(201).json({message: "data stored successfully"});
    } catch (error) {
        console.error(error);
        res.status(500).json({message:"Internal server error"});
    }
}


const DeleteContactData = async(req,res)=>{
    try {
        const {id} = req.params;

        if(!mongoose.Types.ObjectId.isValid(id)) return res.status(400).json({message: "Id is not valid Object ID"});
        const response = await AdminContactSchema.findByIdAndDelete(id);
        if(!response) return res.status(400).json({message: "Data not deleted"});
        res.status(200).json({message: "Data deleted successfully"});

    } catch (error) {
        console.error(error)
        res.status(500).json({message: "Internal server error"})
    }
}

module.exports = {
    PostContactData,
    getContactData,
    getActiveContactData,
    DeleteContactData,
    setActive
}