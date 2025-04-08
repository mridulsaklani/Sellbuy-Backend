const mongoose = require("mongoose");
const xlsx = require("xlsx");
const fs = require("fs").promises; 
const RFQSchema = require("../models/RFQSchema"); 
const RFQHistorySchema = require('../models/RFQHistorySchema')



const getAllRFQ = async (req, res) => {
    try {
        let {page , limit = 10} = req.query;
        page = parseInt(page);
        limit = parseInt(limit);
        const rfqList = await RFQSchema.find().populate(["category", "brand", "createdBy"]).sort({createdAt: -1}).skip((page - 1) * limit).limit(limit).lean();
        if (!rfqList) {
            return res.status(400).json({ message: "No RFQ found" });
        }
        
        const count = await RFQSchema.countDocuments();
        const totalPages = Math.ceil(count / limit);

        return res.status(200).json({rfqList, totalPages});
    } catch (error) {
        console.error("Error in getRFQ:", error);
        return res.status(500).json({ message: "Internal server error" });
    }
};

const getRFQWithId = async(req,res)=>{
    try {
        const id = req?.params?.id

        if(!mongoose.Types.ObjectId.isValid(id)) return res.status(400).json({message: "ID is not valid mongo ID"});

        const response = await RFQSchema.findById(id).populate(['category', 'brand']).lean();
        if(!response) return res.status(400).json({message: "RFQ not found"})
        
        res.status(200).json(response)

    } catch (error) {
        console.error(error);
        res.status(500).json({message: "Internal server error"})
    }
}


const getLoggedUserRFQ = async (req, res) => {
    try {
        let {page , limit = 10} = req.query;
        page = parseInt(page);
        limit = parseInt(limit);

        const id = req.user?._id

        const RFQList = await RFQSchema.find({createdBy: id}).populate(["category", "brand", "createdBy"]).sort({createdAt: -1}).skip((page - 1) * limit).limit(limit).lean();

        if(!RFQList) return res.status(404).json({message: "Data not found"});

        const count = await RFQSchema.countDocuments();
        const totalPages = Math.ceil(count / limit);

        res.status(200).json({RFQList, totalPages});
        
    } catch (error) {
        console.error(error);
        res.status(500).json({message: "Internal server error"})
    }
}

const getRFQHistory = async(req,res)=>{
    try {
        const id = req.params?.id;

        if(!mongoose.Types.ObjectId.isValid(id)) return res.status(400).json({message:"Id is not valid mongo Id"})
        const response = await RFQHistorySchema.find({rfqId: id}).populate("rfqId").lean();
        if(!response) res.status(400).json({message: "Data not found"});
        res.status(200).json(response);

    } catch (error) {
        console.error(error);
        res.status(500).json({message: "Internal server error"});
    }
}

const addRFQ = async (req, res) => {
    try {
        const { product, category,  brand, createdBy, orderQuantity, measurement,  DeliveryLocation, pinCode, comments } = req.body;

        if (!product || !category || !brand || !createdBy || !orderQuantity || !measurement || !DeliveryLocation || !pinCode) {
            return res.status(400).json({ message: "All fields are required" });
        }

        const isValidObjectId = (id) => mongoose.Types.ObjectId.isValid(id);
        if (![category, brand, createdBy].every(isValidObjectId)) {
            return res.status(400).json({ message: "Invalid ID format" });
        }

        if (!req.file) {
            return res.status(400).json({ message: "No file uploaded" });
        }

        const filePath = req.file.path; 

        let sheetData = [];
        try {
           
            const workbook = xlsx.readFile(filePath);
            const sheetName = workbook.SheetNames[0];
            sheetData = xlsx.utils.sheet_to_json(workbook.Sheets[sheetName],{
                blankrows: true,
                range:"A1:N13"

            });
          
            // try {
            //     await fs.access(filePath); // Check if file exists
            //     await fs.unlink(filePath); // Delete file
            // } catch (fileError) {
            //     console.warn("File already deleted or not found:", filePath);
            // }
        
        } catch (error) {
            console.error("Error reading or deleting Excel file:", error);
            return res.status(400).json({ message: "Invalid or corrupted Excel file" });
        }finally {
            
            await fs.unlink(filePath);
        }
        
        const formattedData = sheetData.map((item) => {
            let { "S.No": S_No, "Key parameter": Key_parameter, ...values } = item;
            return {
                S_No,
                Key_parameter,
                values
            };
        });

       const quantityData = JSON.parse(orderQuantity);

        const newRFQ = await RFQSchema.create({
            product,
            category,
            brand,
            createdBy,
            orderQuantity: quantityData,
            measurement,
            DeliveryLocation,
            pinCode,
            comments,
            document: formattedData, 
        });

        if (!newRFQ) {
            return res.status(400).json({ message: "RFQ could not be created" });
        }

        return res.status(201).json({ message: "RFQ created successfully", data: newRFQ });

    } catch (error) {
        console.error("Error in addRFQ:", error);
        return res.status(500).json({ message: "Internal server error" });
    }
};

const editRFQ = async (req, res) => {
    const session = await mongoose.startSession(); 
    session.startTransaction(); 

    try {
        const id = req.params?.id;
        const { product, category, brand,  DeliveryLocation, status, process, comments, pinCode, orderQuantity, additionalComment } = req.body;

        if (!mongoose.Types.ObjectId.isValid(id)) {
            await session.abortTransaction(); 
            return res.status(400).json({ message: "ID is not a valid Mongo ID" });
        }

        // Update RFQ with session
        const response = await RFQSchema.findByIdAndUpdate(
            id,
            { $set: { product, category, brand, DeliveryLocation, status, process, comments, pinCode, orderQuantity, additionalComment } },
            { new: true, runValidators: true, session } 
        );

        if (!response) {
            await session.abortTransaction();
            return res.status(400).json({ message: `${id} RFQ is not updated` });
        }

        const history = await RFQHistorySchema.create([{
            rfqId: id,
            process,
            additionalComment,
            DeliveryLocation,
            pinCode,
            orderQuantity
        }], { session });

        if (!history) {
            await session.abortTransaction();
            return res.status(400).json({ message: "History not created" });
        }

        await session.commitTransaction(); 
        res.status(200).json({ message: `${id} RFQ updated successfully`, updatedRFQ: response });

    } catch (error) {
        console.error(error);
        await session.abortTransaction(); 
        res.status(500).json({ message: "Internal server error" });
    } finally {
        session.endSession(); 
    }
};



const deleteRFQ = async(req, res)=>{
    try {
        const id = req?.params?.id;

        if(!mongoose.Types.ObjectId.isValid(id)) return res.status(400).json({message:"Invalid ID format"});

        const response = await RFQSchema.findOneAndDelete(id);
        if(!response) return res.status(400).json({message: "RFQ not deleted"});
        res.status(200).json({message: "RFQ Deleted successfully"});

    } catch (error) {
        console.log(error);
        res.status(500).json({message: "Internal server error"});
    }
}

module.exports = {addRFQ ,getLoggedUserRFQ ,getRFQWithId, getRFQHistory, getAllRFQ, editRFQ, deleteRFQ};


