const CatalogSchema = require('../models/CatalogSchema');
const mongoose = require("mongoose")

// Get Catalog 

const getPaginatedCatalog = async(req,res)=>{
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

// Get Catalog for Users

const getPaginatedCatalogForUsers = async(req,res)=>{
  const id = req.user?._id

  try {
    let { page = 1, limit = 10 } = req.query; 
    page = parseInt(page);
    limit = parseInt(limit);

    if(!mongoose.Types.ObjectId.isValid(id)) return res.status(400).json({message: "Unauthorized mongoose user id"})

    const response = await CatalogSchema.find({createdBy: id}).populate(["category", 'subCategory', 'seller',"createdBy"]).lean().skip((page - 1) * limit).limit(limit).sort({createdAt: -1});

    if(!response) return res.status(404).json({message: "Catalog not founded"});

    const count = response.length;
    const totalPages = Math.ceil(count / limit);
    
    res.status(200).json({response, totalPages, count});

  } catch (error) {
    console.error(error);
    res.status(500).json({message: "Internal server error"});
  }
}


// Get Catalog by ID

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

// Add Catalogs

const addCatalog = async (req, res) => {
  try {
    const {
      productName,
      category,
      subCategory,
      seller,
      iso,
      specifications,
      addSpecifications,
      paymentSchedule,
      commercialCondition,
      createdBy,
    } = req.body;

  
    const requiredFields = [productName, category, subCategory, seller, iso, paymentSchedule, commercialCondition, createdBy];
    if (requiredFields.some(field => !field)) {
      return res.status(400).json({ message: "Some required fields are missing" });
    }

    if (
      !mongoose.Types.ObjectId.isValid(category) ||
      !mongoose.Types.ObjectId.isValid(subCategory) ||
      !mongoose.Types.ObjectId.isValid(seller) || !mongoose.Types.ObjectId.isValid(createdBy)
    ) {
      return res.status(400).json({ message: "Invalid ID provided" });
    }

    let parsedSpecifications, parsedAddSpecifications, parsedPaymentSchedule, parsedCommercialCondition;
    try {
      parsedSpecifications = JSON.parse(specifications);
      parsedAddSpecifications = JSON.parse(addSpecifications);
      parsedPaymentSchedule = JSON.parse(paymentSchedule);
      parsedCommercialCondition = JSON.parse(commercialCondition);
    } catch (parseError) {
      return res.status(400).json({ message: "Invalid JSON in one or more fields", error: parseError.message });
    }

   
    const newCatalog = await CatalogSchema.create({
      productName,
      category,
      subCategory,
      seller,
      iso,
      specifications: parsedSpecifications,
      addSpecifications: parsedAddSpecifications,
      paymentSchedule: parsedPaymentSchedule,
      commercialCondition: parsedCommercialCondition,
      condition: req.file ? req.file.path : "",
      createdBy,
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

// Update Catalog

const updateCatalog = async(req,res)=>{
  
  const session = await mongoose.startSession();
  session.startTransaction()

  try {
    const {id} = req.params;
    
    const {category, subCategory, seller, iso, specifications, addSpecifications, paymentSchedule, commercialCondition} = req.body;

    if(!mongoose.Types.ObjectId.isValid(id)) return res.status(400).json({message: 'Id is not valid mongoose object id'});

    const response = await CatalogSchema.findByIdAndUpdate(id,
      {$set: {category, subCategory, seller, iso, specifications, addSpecifications, paymentSchedule, commercialCondition}},
      {new: true, runValidators: true, session}
    );

    if(!response) {
      await session.abortTransaction();
      return res.status(404).json({message: "Catalog not updated"})
      
    }

    const FinalPriceCalculation = await response.calculateFinalPrice(commercialCondition.productPrice, commercialCondition.productDiscount , session);

    if(!FinalPriceCalculation) {
      await session.abortTransaction()
      return res.status(400).json({message: "Final price not change"});
    }

    await session.commitTransaction();
    res.status(200).json({message: "Catalog updated successfully"});
    
  } catch (error) {
    await session.abortTransaction();
    console.error(error);
    res.status(500).json({message: "Internal server error"});
  }
  finally{
    await session.endSession()
  }
}

// Delete Catalog

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
  getPaginatedCatalog,
  getPaginatedCatalogForUsers,
  addCatalog,
  getCatalogById,
  updateCatalog,
  deleteCatalog,
};
