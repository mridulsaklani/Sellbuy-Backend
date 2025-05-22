const mongoose = require("mongoose")
const orderSchema = require('../models/OrderSchema.js');
const VRFQSchema = require("../models/VRFQSchema.js");
const userSchema = require("../models/UserModel.js");
const OrderSchema = require("../models/OrderSchema.js");

const getTotalOrderReceive = async(req,res)=>{
    try{
       let limit = 6
       
      

       const response = await orderSchema.find({}).populate({path: "vrfqId", populate:{path: "brfqId", model: "brfq", populate:{path: "rfqId", model:"rfq", populate:{path:"createdBy", model:"user"}}}}).limit(limit).sort({createdAt: -1});

       if(!response) return res.status(404).json({message: 'Order data not founded'})
       

       return res.status(200).json({message: "Order data get successfully", orders : response})
    }
    catch(error){
       console.error(error);
       res.status(500).json({message: "Internal server error"});
    }
}


const getAllOrder = async(req, res)=>{
    try {
        let {page, limit = 10} = req.query;
        page = parseInt(page);
        limit = parseInt(limit)

        const response = await orderSchema.find({status: false}).populate({path: "vrfqId", populate:{path: "brfqId", model: "brfq", populate:{path: "rfqId", model:"rfq", populate:{path:"createdBy", model:"user"}}}}).skip((page - 1) * limit).limit(limit).sort({createdAt: -1});
        if(!response) return res.status(404).json({message: "Order data not found"})

        const count = response.length;
        const totalPages = Math.ceil(count / limit);

        return res.status(200).json({message: "Order data get successfully", orders : response, totalPages})

    } catch (error) {
        console.error(error);
        res.status(500).json({success: false, message: 'Internal server error'})
    }
}

const dailyOrderReceived = async (req, res) => {
  try {
    const today = new Date();
    today.setUTCHours(0, 0, 0, 0);

    const sevenDaysAgo = new Date(today);
    sevenDaysAgo.setUTCDate(today.getUTCDate() - 6);

    const response = await orderSchema.find({
      createdAt: {
        $gte: sevenDaysAgo,
        $lte: new Date()
      }
    });

    const days = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
let orderCountByDay = [];

for (let i = 0; i < 7; i++) {
  orderCountByDay.push({ day: days[i], sales: 0 });
}

response.forEach(order => {
  const dayIndex = new Date(order.createdAt).getUTCDay();
  orderCountByDay[dayIndex].sales++;
});

return res.status(200).json({ success: true, weeklyOrderData: orderCountByDay });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ success: false, message: "Internal server error" });
  }
};




const getOrderHistory = async(req, res)=>{
    try {
        let {page, limit = 10} = req.query;
        page = parseInt(page);
        limit = parseInt(limit)

        const response = await orderSchema.find({status: true}).populate({path: "vrfqId", populate:{path: "brfqId", model: "brfq", populate:{path: "rfqId", model:"rfq", populate:{path:"createdBy", model:"user"}}}}).skip((page - 1) * limit).limit(limit).sort({createdAt: -1});

        if(!response) return res.status(404).json({message: "Orders history not found"});

        const count = response.length;
        const totalPages = Math.ceil(count / limit);

        return res.status(200).json({message: "Order history data get successfully", orders : response, totalPages})


    } catch (error) {
        console.error(error);
        res.status(500).json({message: "Internal server error"})
    }
}

const getBuyerOrderHistory = async(req,res)=>{
    try {
        let {page, limit= 10} = req.query;

          page = parseInt(page);
          limit = parseInt(limit)

        const id = req.user._id

        if(!mongoose.Types.ObjectId.isValid(id)) return res.status(400).json({message: "Invalid mongoose user Id"}) 
        
        const response = await orderSchema.find({buyer: {$eq: id}, status: true}).populate({path: "vrfqId", populate:{path: "brfqId", model: "brfq", populate:{path: "rfqId", model:"rfq", populate:{path:"createdBy", model:"user"}}}}).skip((page - 1) * limit ).limit(limit).sort({createdAt:-1})

        if(!response) return res.status(404).json({message: "History not found"})
        
        const count = response.length;
        const totalPages = Math.ceil(count/limit);

        return res.status(200).json({message: "History fetch successfully", orders: response, totalPages})

    } catch (error) {
        console.error(error);
        res.status(500).json({message:"Internal server error"})
    }
}

const getSupplierOrderHistory = async(req,res)=>{
    try {
        let {page, limit= 10} = req.query;

          page = parseInt(page);
          limit = parseInt(limit)

        const id = req.user._id

        if(!mongoose.Types.ObjectId.isValid(id)) return res.status(400).json({message: "Invalid mongoose user Id"}) 
        
        const response = await orderSchema.find({supplier: {$eq: id}, status: true}).populate({path: "vrfqId", populate:{path: "brfqId", model: "brfq", populate:{path: "rfqId", model:"rfq", populate:{path:"createdBy", model:"user"}}}}).skip((page - 1) * limit ).limit(limit).sort({createdAt:-1})

        if(!response) return res.status(404).json({message: "History not found"})
        
        const count = response.length;
        const totalPages = Math.ceil(count/limit);

        return res.status(200).json({message: "History fetch successfully", orders: response, totalPages})

    } catch (error) {
        console.error(error);
        res.status(500).json({message: "Internal server error"})
    }
}

const getOrderById = async(req,res)=>{
    try {
        const id = req.params.id;

        if(!mongoose.Types.ObjectId.isValid(id)) return res.status(400).json({message: "ID is not valid mongoose id"});

        const response = await orderSchema.findById(id).populate({path: "vrfqId", populate:[{path: "brfqId", model: "brfq", populate:{path: "rfqId", model:"rfq", populate:{path:"createdBy", model:"user"}}},{path:"TotalPrice.product", model: "Catalog"}]}).lean()

        if(!response) return res.status(404).json({message: "Order data not found"})

        return res.status(200).json({message: "Order data get successfully", orders: response})
        
    } catch (error) {
        console.log(error);
        res.status(500).json({message: "Internal server error"})
    }
}

const getSupplierUserOrder = async(req,res)=>{

    try {
        let {page, limit = 10} = req.query;
        page = parseInt(page);
        limit = parseInt(limit)


        const id = req.user.id;
        if(!mongoose.Types.ObjectId.isValid(id)) return res.status(400).json({message: "Invalid mongoose user id"})

        const response = await orderSchema.find({supplier: {$eq: id}, status: false}).populate({path: "vrfqId", populate:{path: "brfqId", model: "brfq", populate:{path: "rfqId", model:"rfq", populate:{path:"createdBy", model:"user"}}}}).skip((page - 1) * limit).limit(limit).sort({createdAt: -1});

        if(!response) return res.status(404).json({message: "Order data not found"});

        const count = response.length;
        const totalPages = Math.ceil(count / limit);
        
        return res.status(200).json({message: "Order data get successfully", orders : response, totalPages});

    } catch (error) {
        console.error(error);
        res.status(500).json({message: "Internal server error"})
    }
}

const getBuyerUserOrder = async(req, res)=>{
    try {
        let {page, limit = 10} = req.query;
        page = parseInt(page);
        limit = parseInt(limit)


        const id = req.user.id;
        if(!mongoose.Types.ObjectId.isValid(id)) return res.status(400).json({message: "Invalid mongoose user id"})

        const response = await orderSchema.find({buyer: {$eq: id}, status: false}).populate({path: "vrfqId", populate:{path: "brfqId", model: "brfq", populate:{path: "rfqId", model:"rfq", populate:{path:"createdBy", model:"user"}}}}).skip((page - 1) * limit).limit(limit).sort({createdAt: -1});

        if(!response) return res.status(404).json({message: "Order data not found"});

        const count = response.length;
        const totalPages = Math.ceil(count / limit);
        
        return res.status(200).json({message: "Order data get successfully", orders : response, totalPages});

    } catch (error) {
        console.error(error);
        res.status(500).json({message: "Internal server error"})
    }
}


const generateOrder = async(req, res)=>{
    const session = await mongoose.startSession();
    session.startTransaction()

    const {vrfqId, supplier, buyer} = req.body;
    try {

        if(!mongoose.Types.ObjectId.isValid(vrfqId)) return res.status(400).json({success: false, message: "Invalid mongoose ID"})

        const vrfq = await orderSchema.findOne({vrfqId:vrfqId}).session(session);

     if(vrfq) {
        await session.abortTransaction()
        return res.status(400).json({message: "VRFQ already approved"})
     } 
        
     const response = await orderSchema.create([{vrfqId, supplier, buyer}],{session});
     if(!response){
        await session.abortTransaction()
        return res.status(400).json({success: false, message: "VRFQ not approved and order not generated"});
         
     } 

     const VrfqApproval = await VRFQSchema.findByIdAndUpdate(vrfqId, {$set:{process: "approved by admin", status: true}}, {new: true, runValidators: true, session});

     if(!VrfqApproval){
        await session.abortTransaction();
        return res.status(400).json({success: false, message: 'VRFQ process not updated'})
     }

     await session.commitTransaction()
     res.status(201).json({success: true, message: "VRFQ approved and order placed successfully"})

    } catch (error) {
        console.log(error);
        await session.abortTransaction()
         return res.status(500).json({success: false, message: 'Internal server error'})
    }
    finally{
        await session.endSession()
    }
}

const updateOrderTracker = async(req,res)=> {
    try {
        const id = req.params?.id;
        const {process} = req.body;
        const userId = req.user._id

        if(!mongoose.Types.ObjectId.isValid(id) || !mongoose.Types.ObjectId.isValid(userId)) return res.status(401).json({message: "Unauthorized mongoose id"})

        if(!process) return res.status(400).json({message: "Process field not found"});
        const user = await userSchema.findById(userId)

        const order = await orderSchema.findById(id).lean();

        if(!order) return res.status(404).json({message: "Order data not found"})

        if(order.status === true){
          return  res.status(401).json({message: "Order is already delivered"});
        }

        
        let response;

        if(process === "delivered"){
             response = await orderSchema.findByIdAndUpdate(id,{$set: {process, status: true}},{new: true, runValidators: true});
             const completedOrderbySupplier = await orderSchema.find({supplier: {$eq: userId}, status: true});
     
             user.deliveries = Number(completedOrderbySupplier.length)
             await user.save()
        }
        else{
            response = await orderSchema.findByIdAndUpdate(id,{$set: {process}},{new: true, runValidators: true});
        }

        if(!response) return res.status(400).json({message: "Order data not updated"});

        return res.status(200).json({message: "Order data updated successfully", updatedData: response})


    } catch (error) {
        console.error(error);
        res.status(500).json({message: "Internal server error"})
    }
}


const getTotalOrderCount = async (req, res) => {
    try {
        const response = await orderSchema.aggregate([
            {
                $count: "totalOrders"
            }
        ]);
        
        const totalOrders = response[0]?.totalOrders || 0;

        res.status(200).json({ totalOrders });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Internal server error" });
    }
};

const getOrderCountForSupplier = async(req,res)=>{
    try{
        const id = req.user._id

        console.log(id)

        const response = await OrderSchema.aggregate([
            {
                $match: {
                    supplier: new mongoose.Types.ObjectId(id),
                    
                }
            },
            {
                $count: "totalOrders"
            }
        ]);

        const totalOrders = response[0]?.totalOrders || 0;
        res.status(200).json({ totalOrders });
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ message: "Internal server error" });
    }
}
const getSupplierOrderDeliverCount = async(req,res)=>{
    try{
        const id = req.user._id

      

        const response = await OrderSchema.aggregate([
            {
                $match: {
                    supplier: new mongoose.Types.ObjectId(id),
                    status: true
                    
                }
            },
            {
                $count: "totalOrders"
            }
        ]);

        const orderCount = response[0]?.totalOrders || 0;
        res.status(200).json({ orderCount });
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ message: "Internal server error" });
    }
}




module.exports = {
    getTotalOrderReceive,
    getAllOrder,
    getOrderHistory,
    getOrderById,
    dailyOrderReceived,
    getSupplierUserOrder,
    getBuyerUserOrder,
    getBuyerOrderHistory,
    getSupplierOrderHistory,
    generateOrder,
    getTotalOrderCount,
    updateOrderTracker,
    getOrderCountForSupplier,
    getSupplierOrderDeliverCount
}