const VRFQSchema = require("../models/VRFQSchema");
const mongoose = require("mongoose");

const getAllVRFQ = async (req, res) => {
  try {
    const response = await VRFQSchema.find({})
      .populate([
        { path: "brfqId", populate: [{ path: "rfqId", model: "rfq", populate:{path: "createdBy", model:"user"} }] },
        { path: "createdBy", model: "user" },
      ])
      .sort({ createdAt: -1 });
    if (!response)
      return res
        .status(404)
        .json({ success: false, message: "VRFQ's not found" });

    return res
      .status(200)
      .json({ message: "VRFQ's fetched successfully", vrfq: response });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal server error" });
  }
};

const getVRFQByCreator = async (req, res) => {
  const id = req.user?._id;
  try {
    if (!mongoose.Types.ObjectId.isValid(id))
      return res.status(400).json({ message: "Invalid mongoose ID" });

    const response = await VRFQSchema.find({ createdBy: id })
      .populate({ path: "brfqId", populate: { path: "rfqId", model: "rfq" } })
      .populate({
        path: "TotalPrice",
        populate: { path: "product", model: "Catalog" },
      })
      .sort({ createdAt: -1 });

    if (!response) return res.status(404).json({ message: "VRFQ not found" });
    return res
      .status(200)
      .json({ message: "VRFQ fetched successfully", vrfq: response });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal server error" });
  }
};

const getVRFQById = async (req, res) => {
  try {
    const id = req.params?.id;
    if (!mongoose.Types.ObjectId.isValid(id))
      return res.status(400).json({ message: "Invalid mongoose ID" });

    const response = await VRFQSchema.findById(id)
      .populate([
        {
          path: "brfqId",
          populate: {
            path: "rfqId",
            model: "rfq",
            populate: [{ path: "createdBy", model: "user" }, {path: "category", model:"Category"}],
          },
        },
        { path: "createdBy" },
      ])
      .populate({
        path: "TotalPrice",
        populate: { path: "product", model: "Catalog" },
      });

    if (!response)
      return res
        .status(404)
        .json({ success: false, message: "VRFQ not found" });

    return res
      .status(200)
      .json({ message: "VRFQ Get successfully", vrfq: response });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal server error" });
  }
};

const createVRFQ = async (req, res) => {
  try {
    const { brfqId, createdBy, spreadQuantityData, additionalComment, price } =
      req.body;

    if (!mongoose.Types.ObjectId.isValid(createdBy))
      return res.status(400).json({ message: "Invalid mongoose ID" });

    
    if (
      !brfqId ||
      !createdBy ||
      !spreadQuantityData ||
      !additionalComment ||
      !price
    )
    return res.status(400).json({ message: "All fields are required" });
    
    const vrfq = await VRFQSchema.findOne({brfqId: brfqId, createdBy: createdBy}).lean()


    if(vrfq) return res.status(400).json({message: "You already send quotation for this BRFQ"})


    const response = await VRFQSchema.create({
      brfqId,
      createdBy,
      spreadQuantityData,
      additionalComment,
      TotalPrice: price,
    });

    if (!response) return res.status(400).json({ message: "VRFQ not created" });

    return res
      .status(201)
      .json({ message: "VRFQ created successfully", response });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal server error" });
  }
};

const rejectingVRFQ = async(req, res)=>{
  try {
    const {process} = req.body;
    const id = req.params?.id;

    if (!mongoose.Types.ObjectId.isValid(id)){

      return res.status(404).json({ message: "Invalid mongoose Id" });
    }

    const vrfq = await VRFQSchema.findById(id).lean();

    if(vrfq.process === "rejected by admin"){
      return res.status(400).json({message: "VRFQ is already rejected"})
    }

    const response = await VRFQSchema.findByIdAndUpdate(id,{$set:{process}},{new: true, runValidators: true});
    if(!response) return res.status(400).json({message: "VRFQ not updated"});

    return res.status(200).json({message: "VRFQ updated successfully"});

  } catch (error) {
    console.error(error);
    res.status(500).json({message: "Internal server error"})
  }
}

const negotiateVRFQ = async(req,res)=>{
  try {
    const {id} = req.params;
    const {process} = req.body;

    if (!mongoose.Types.ObjectId.isValid(id)){
      return res.status(404).json({ message: "Invalid mongoose Id" });
    }

    const vrfq = await VRFQSchema.findById(id).lean();

    if(vrfq.process === "negotiate") return res.status(400).json({message: "VRFQ is already negotiated"});

    const response = await VRFQSchema.findByIdAndUpdate(id, {$set:{process}}, {new: true, runValidators: true});
    if(!response) return res.status(400).json({message: "VRFQ not updated"});

    return res.status(200).json({message: "VRFQ updated successfully"});
    

  } catch (error) {
    console.error(error);
    res.status(500).json({message: "Internal server error"})
  }
}

const updateVRFQ = async (req, res) => {
  try {
    const { brfqId, createdBy, process, additionalComment, spreadQuantityData, price } = req.body;

    const id = req.params?.id;

    if (!mongoose.Types.ObjectId.isValid(id)){

      return res.status(404).json({ message: "Invalid mongoose Id" });
    }

    const response = await VRFQSchema.findByIdAndUpdate(
      id,
      {
        $set: {
          brfqId,
          createdBy,
          process,
          additionalComment,
          spreadQuantityData,
          TotalPrice: price
        },
      },
      { new: true, runValidators: true }
    );

    if (!response)
      return res
        .status(400)
        .json({ success: false, message: "VRFQ not updated" });

    return res
      .status(200)
      .json({ success: true, message: "VRFQ updated successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
};

module.exports = {
  getAllVRFQ,
  createVRFQ,
  getVRFQById,
  getVRFQByCreator,
  updateVRFQ,
  rejectingVRFQ,
  negotiateVRFQ
};
