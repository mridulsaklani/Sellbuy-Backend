const FAQSchema = require('../models/FAQModel');

// For Get FAQ
const getFAQ = async (req, res) => {
    try {
        const faq = await FAQSchema.find();
        if(!faq) return res.status(401).json({message: "faq not found"});
        return res.status(201).json(faq)

    } catch (error) {
        console.log(error);
        res.status(500).json({message:" Internal server error"})
        
    }
}

// FOR Adding FAQ

const addFAQ = async (req, res) => {
    try {
        const {question, answer, createdAt, isActive, tags} = req.body;
        
        const addFaq = await FAQSchema.create({question, answer, createdAt, isActive, tags});
        if(!addFaq) return res.status(401).json({message: "fields is missing"});
        return res.status(201).json({message: "FAQ added successfully"})
    } catch (error) {
        console.log(error);
        res.status(500).json(error)
    }
}

module.exports = {
    getFAQ, addFAQ
}