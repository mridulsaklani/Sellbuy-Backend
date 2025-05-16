const mongoose = require("mongoose");
const BRFQSchema = require("../models/BRFQSchema");

const getAllBRFQ = async (req, res) => {
  try {
    const response = await BRFQSchema.find({})
      .populate({
        path: "rfqId",
        populate: {
          path: "createdBy",
          model: "user",
          select: "-password -refreshToken",
        },
      })
      .sort({ createdAt: -1 })
      .lean();
    if (!response) return res.status(404).json({ message: "BRFQs not found" });
    res.status(200).json({
      message: "BRFQs fetched successfully",
      brfqs: response,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal server error" });
  }
};

const getBRFQById = async (req, res) => {
  try {
    const id = req.params?.id;

    if (!mongoose.Types.ObjectId.isValid(id))
      return res.status(400).json({ message: "Authorized object ID" });

    const response = await BRFQSchema.findById(id)
      .populate({
        path: "rfqId",
        populate: [{
          path: "createdBy",
          model: "user",
          select: "-password -refreshToken",
        },
        { path: "category", model: "Category" }
    ],
        
      })
      .lean();

    if (!response) return res.status(404).json({ message: "BRFQ's not found" });

    res.status(200).json({ success: true, brfq: response });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal server error" });
  }
};

module.exports = { getAllBRFQ, getBRFQById };
