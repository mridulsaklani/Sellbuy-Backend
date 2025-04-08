const SpecificationSchema = require("../models/SpecificationSchema");
const mongoose = require("mongoose");


const getSpecification = async(req,res)=>{
    try {
        const response = await SpecificationSchema.find().populate('category');
        if(!response) return res.status(404).json({message: "Specifications are not found"});
        res.status(200).json(response);
    } catch (error) {
        console.error(error);
        res.status(500).json({message: "Internal Server Error"});
    }
}

const getPaginatedSpecification = async(req,res)=>{
    try {
        let { page = 1, limit = 10 } = req.query;
        page = parseInt(page);
        limit = parseInt(limit)

        const count = await SpecificationSchema.countDocuments();
        const response = await SpecificationSchema.find().populate('category').sort({createdAt: -1}).skip((page - 1) * limit).limit(limit);
        
        const totalPages = Math.ceil(count / limit);

        if(!response) return res.status(404).json({message: "Specifications are not found"});
        res.status(200).json({response, totalPages});
    } catch (error) {
        console.error(error);
        res.status(500).json({message: "Internal Server Error"});
    }
}

const addSpecification = async(req,res)=>{
    try {
        const {name, category} = req.body;

        if(!name || !category) return res.status(404).json({message: "Field is missing"});

        if (!mongoose.Types.ObjectId.isValid(category)) {
                      return res.status(400).json({ message: "Invalid category ID" });
                    }

        const response = await SpecificationSchema.create({name, category});
        if(!response) return res.status(404).json({message:"Specification not created"});
            res.status(201).json({message:"Specification created successfully"});

    } catch (error) {
        console.error(error);
        res.status(500).json({message: error})
    }
}

const updateSpecification = async(req,res)=>{
    try {
        const {id} = req.params;
        const {name, category} = req.body;


        if(!name || !category || !id) return res.status(400).json({message: 'All field is required'});
        
        if(!mongoose.Types.ObjectId.isValid(category)) return res.status(400).json({message: "The Category ID is not valid ID"});

        if(!mongoose.Types.ObjectId.isValid(id)) return res.status(400).json({message: "The update specification ID is not valid ID"});
       
        const response = await SpecificationSchema.findByIdAndUpdate(id,
             {$set: {name, category}}, 
            {new: true, runValidators: true}
        )
         
        if(!response) return res.status(404).json({message: "Specification not updated"})
        res.status(200).json({message: `${name} Specification updated successfully`})

    } catch (error) {
        console.error(error)
        res.status(500).json({message: "Internal Server Error"})
    }
}

const deleteSpecification = async(req,res)=>{
    try {
        const {id} = req.params 

        if(!id) return res.status(404).json({message: "Id not found"});

        const response = await SpecificationSchema.findByIdAndDelete(id);
        if(!response) return res.status(404).json({message:"Specification not deleted"});
            res.status(200).json({message:"Specification deleted successfully"});
    } catch (error) {
        console.error(error);
        res.status(500).json({message: "Internal Server Error"});
    }
}

module.exports = {getSpecification, getPaginatedSpecification, addSpecification, updateSpecification, deleteSpecification}