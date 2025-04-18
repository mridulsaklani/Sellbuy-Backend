const { response } = require("express");
const AssignedBRFQSchema = require("../models/AssignedBRFQSchema");
const BRFQSchema = require("../models/BRFQSchema");
const mongoose = require("mongoose");

const addAssigned = async (req, res) => {
  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    const { brfqId, supplierIds } = req.body;

    if (!mongoose.Types.ObjectId.isValid(brfqId)) {
      return res.status(400).json({ message: "Invalid BRFQ ID" });
    }

    if (!brfqId || !supplierIds || !Array.isArray(supplierIds)) {
      return res.status(400).json({ message: "Missing or invalid data" });
    }

    const isAlreadyAssigned = await AssignedBRFQSchema.findOne({ brfqId: { $eq: brfqId } }).session(session);
    if (isAlreadyAssigned) {
      await session.abortTransaction();
      return res.status(400).json({ message: "BRFQ already assigned" });
    }

    const response = await AssignedBRFQSchema.create(
      [{ brfqId, supplierId: supplierIds }],
      { session }
    );

    if (!response) {
      await session.abortTransaction();
      return res.status(400).json({ message: "Document not created" });
    }

    
    const updatedBRFQ = await BRFQSchema.findByIdAndUpdate(
      brfqId,
      { $set: { assigned: true } },
      { new: true, runValidators: true, session }
    );

    if (!updatedBRFQ) {
      await session.abortTransaction();
      return res.status(400).json({ message: "BRFQ not updated" });
    }

    await session.commitTransaction();
    

    res.status(200).json({
      message: "BRFQ assigned successfully",
      assignedData: response[0],
      updatedBRFQ,
    });

  } catch (error) {
    console.error(error);
    await session.abortTransaction();
    
    res.status(500).json({ message: "Internal server error" });
  }
  finally{
    session.endSession();
  }
};


const getAllAssignedBRFQ = async(req,res)=>{
    try {
        const response = await AssignedBRFQSchema.find({}).lean();
        
        if(!response) return res.status(404).json({message: "Assigned BRFQ's not found"});

        res.status(500).json({message: "Assigned BRFQ's fetched successfully", assignedBRFQ: response});
    } catch (error) {
        console.log(error);
        res.status(500).json({message: "Internal server error"});
    }
}

const getAssignedBRFQbySupplier = async(req,res)=>{
    try {
        const id = req.user?._id;

        if(!mongoose.Types.ObjectId.isValid(id)) return res.status(400).json({message: "Unauthorized mongoose id"});

        const response = await AssignedBRFQSchema.find({supplierId: {$eq: id}}).populate({path: "brfqId", populate:{path: "rfqId", model: "rfq"}}).sort({createdAt: -1});

        if(!response) return res.status(404).json({message: "Assigned BRFQ not found"});

        res.status(200).json({message: "Assigned BRFQ received successfully" ,assignBRFQ: response});

    } catch (error) {
        console.error(error);
        res.status(500).json({message: "Internal server error"});
    }
}

const getAssignedBRFQbyId = async(req,res)=>{
  try {
       const {id} = req.params;
       
       if(!mongoose.Types.ObjectId.isValid(id)) return res.status(400).json({message: "Invalid mongoose Id"});

       const getBRFQ = await AssignedBRFQSchema.findById(id).populate({path: "brfqId", populate:{path: "rfqId", model: "rfq" , populate:[{path:"category", model: "Category"},{path:"brand",model:"user"}]} });

       if(!getBRFQ) return res.status(404).json({message: "Assigned BRFQ not found"});

       res.status(200).json({message: "Assigned BRFQ received successfully", brfq: getBRFQ});


  } catch (error) {
    console.error(error);
    res.status(500).json({message: "Internal server error"});
  }
}

module.exports = {
  addAssigned, getAssignedBRFQbySupplier, getAssignedBRFQbyId, getAllAssignedBRFQ
};
