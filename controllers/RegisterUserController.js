const registerUserSchema = require('../models/RegisterUserModel')



const addUser = async (req, res) => {
    try {
        const { first_name, last_name, email, phone, company_name, role, message } = req.body;
        if(!first_name || !last_name || !email || !phone || !company_name || !role || !message) return res.status(400).json({ message: "All fields are required" });

        const user = await registerUserSchema.create({first_name, last_name, email, phone, company_name, role, message});
        if(!user) return res.status(400).json({ message: "User not created" });
        res.status(201).json({message: "User created successfully"});

    } catch (error) {
        console.error(error);
        res.status(500).json({ message: error.message });
    }
};

const getUser = async(req, res)=>{
    try {
        const response = await registerUserSchema.find({});
        if(!response) return res.status(404).json({message: "Users not found"})
            res.status(200).json(response);
    } catch (error) {
        console.error(error);
        res.status(500).json({message: "Internal Server Error"});
    }
}

const getSellerUser = async(req,res)=>{
    try {
        const response = await registerUserSchema.find({role: {$eq: "supplier"} });
        if(!response) return res.status(404).json({message: "Suppliers User not found"})
        res.status(200).json(response)

    } catch (error) {
        console.error(error);
        res.status(500).json({message: "Internal Server Error"});
    }
}



module.exports = {
    getUser,
    getSellerUser,
    addUser,
}