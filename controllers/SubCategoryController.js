const SubCategorySchema = require('../models/SubCategorySchema')
const mongoose = require('mongoose');


const getSubCategory = async(req,res) =>{
    try {
        const subCategory = await SubCategorySchema.find().populate('categoryId').sort({createdAt : -1});
     
        if(!subCategory) return res.status(404).json({message: "Sub Categories not found"});
        return res.status(200).json(subCategory)
    } catch (error) {
        console.error(error);
        res.status(500).json({message:"Sub Categories not found"})
    }
}

const getPaginatedSubCategory = async(req,res) =>{
    try {
         let {page = 1 , limit = 10} = req.query;
         page = parseInt(page);
         limit = parseInt(limit)

         const count = await SubCategorySchema.countDocuments();

        const subCategory = await SubCategorySchema.find().populate('categoryId').sort({createdAt:-1}).skip((page - 1) * limit).limit(limit);
     
        if(!subCategory) return res.status(404).json({message: "Sub Categories not found"});
        const totalPages = Math.ceil(count / limit);
    
        return res.status(200).json({subCategory, totalPages, count});

    } catch (error) {
        console.error(error);
        res.status(500).json({message:"Sub Categories not found"});
    }
}

const getSubCategoryWithAssignedCategory = async(req,res)=>{
    try {
         const id = req.params?.id;

         if(!mongoose.Types.ObjectId.isValid(id)) return res.status(400).json({message: "Unauthorized mongoose category id"});

        const subCategory = await SubCategorySchema.find({categoryId:id}).populate("categoryId");

        if(!subCategory) return res.status(404).json({message: "Sub Categories not found behalf of category"});

        return res.status(200).json({message: "Sub Categories fetched successfully", subCategory})

    } catch (error) {
      console.error(error);
      res.status(500).json({message: "Internal server error"})
    }
}

const addSubCategory = async(req,res)=>{
    try {
        const {name, categoryId} = req.body;
        if (!name || !categoryId) {
            return res.status(400).json({message:"All fields are required"});
        }

         if (!mongoose.Types.ObjectId.isValid(categoryId)) {
              return res.status(400).json({ message: "Invalid category ID" });
            }

        const subCategory = await SubCategorySchema.create({name, categoryId});
        if (!subCategory) {
            return res.status(401).json({message:"SubCategory not created"});
        }
        return res.status(201).json({message:"SubCategory created successfully"})
    } catch (error) {
        console.error(error)
        res.status(500).json({message:"Internal Server error!"})
    }
}

const patchSubCategory = async(req,res) =>{
    try {
        const {id} = req.params;
        const {name, categoryId} = req.body;
        
        if (!mongoose.Types.ObjectId.isValid(id)) {
              return res.status(400).json({ message: "Invalid category ID" });
            }

        if (!name || !categoryId) return res.status(400).json({message: "The name field is missing"});

        const updatedSubCategory = await SubCategorySchema.findByIdAndUpdate(
            id,
             { $set: {name, categoryId} },
            {new: true, runValidators: true}
        )
        if(!updatedSubCategory) return res.status(404).json({message: "Sub Category is not updated"})
            res.status(200).json({message: "Sub category updated successfully"})
    } catch (error) {
        console.error(error.message)
        res.status(500).json({message: "Internal server error"})
    }
}

const deleteSubCategory = async(req,res)=>{
    try {
        const { id }=  req.params

         if (!mongoose.Types.ObjectId.isValid(id)) {
              return res.status(400).json({ message: "Invalid sub category ID" });
            }

        const deletion = await SubCategorySchema.findByIdAndDelete(id)
        if(!deletion) return res.status(404).json({message: "Sub category not found"})

        res.status(200).json({message:"Sub category delete successfully"})
    } catch (error) {
        console.error(error);
        res.status(500).json({message: "Internal server error"})
    }
}


module.exports = {getSubCategory, getPaginatedSubCategory, getSubCategoryWithAssignedCategory, addSubCategory, patchSubCategory, deleteSubCategory}