const CatalogSchema = require('../models/CatalogSchema');
const mongoose = require("mongoose")


const getCatalog = async(req,res)=>{
    try {
      let { page = 1, limit = 10 } = req.query; 
      page = parseInt(page);
      limit = parseInt(limit);

      const response = await CatalogSchema.find({}).populate(["category", 'subCategory', 'seller']).lean().skip((page - 1) * limit).limit(limit).sort({createdAt: -1});

      if(!response) return res.status(404).json({message: "Catalog not founded"});

      const count = await CatalogSchema.countDocuments();
      const totalPages = Math.ceil(count / limit);
      
        res.status(200).json({response, totalPages, count});

    } catch (error) {
      console.error(error);
      res.status(500).json({message: "Internal server error"});
    }
}




const getCatalogById = async(req, res)=>{
  try{
     const {id} = req.params;

     if(!mongoose.Types.ObjectId.isValid(id)) return res.status(400).json({message:"Catalog Invalid Id"});
     const response = await CatalogSchema.findById(id).populate(["category", 'subCategory', 'seller','specifications.key']).lean();
     if(!response) return res.status(404).json({message: "Catalog not found"});
      res.status(200).json(response);
  }
  catch(error){
       console.error(error)
       res.status(500).json({message: "Internal Server Error"});
  }
}

const addCatalog = async (req, res) => {
  try {
    const { category, subCategory, seller, iso, specifications, addSpecifications, createdBy } = req.body;

    if (!category || !subCategory || !seller || !iso || !createdBy) {
        return res.status(400).json({ message: "Sorry your field data is missing, please check it and try again" });
      }

    if(!mongoose.Types.ObjectId.isValid(category) || !mongoose.Types.ObjectId.isValid(subCategory) || !mongoose.Types.ObjectId.isValid(seller)) return res.status(400).json({message: "Invalid ID"});

    const newCatalog = await CatalogSchema.create({
      category,
      subCategory,
      seller,
      iso,
      specifications,
      addSpecifications,
      createdBy
    });

    return res.status(201).json({
      message: "Catalog created successfully",
      data: newCatalog,
    });
  } catch (error) {
    return res.status(500).json({
      message: "Failed to create catalog",
      error: error.message,
    });
  }
};

const updateCatalog = async(req,res)=>{
  try {
    const {id} = req.params;
    
    const {category, subCategory, seller, iso, specifications, addSpecifications} = req.body;

    if(!id) return res.status(404).json({message: "Id not found"});
    if(!mongoose.Types.ObjectId.isValid(id)) return res.status(400).json({message: 'Id is not valid mongoose object id'});

    const response = await CatalogSchema.findByIdAndUpdate(id,
      {$set: {category, subCategory, seller, iso, specifications, addSpecifications}},
      {new: true, runValidators: true}
    );
    if(!response) return res.status(404).json({message: "Catalog not updated"})
    res.status(200).json({message: "Catalog updated successfully"})
    
  } catch (error) {
    console.error(error);
    res.status(500).json({message: "Internal server error"})
  }
}

const deleteCatalog = async(req,res)=>{
  try {
    const {id} = req.params;
    if(!id) return res.status(404).json({message: "Id not found"});
    if(!mongoose.Types.ObjectId.isValid(id)) return res.status(400).json({message: 'Id is not valid mongoose object id'});

    const response = await CatalogSchema.findByIdAndDelete(id);
    if(!response) res.status(400).json({message: "Catalog not deleted"});

    res.status(200).json({message: "Catalog deleted successfully"})

  } catch (error) {
    console.error(error);
    res.status(500).json({message: "Internal server error"})
  }
}



module.exports = {
  getCatalog,
  addCatalog,
  getCatalogById,
  updateCatalog,
  deleteCatalog,
};
