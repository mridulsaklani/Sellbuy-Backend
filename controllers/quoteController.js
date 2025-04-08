const quoteSchema = require("../models/QuoteModel");
const Multer = require('multer');
const path = require('path');

const storage = Multer.diskStorage({
    destination: (req, file, cb) => {
    //   const uploadPath = path.join(__dirname, '/uploads');
      cb(null, "./uploads");
    },
    filename: (req, file, cb) => {
      cb(null, `${Date.now()}-${file.originalname}`);
    },
  });
  

const Upload = Multer({ storage });

const addQuote = async (req, res) => {
 
    try {
        const {fname, lname, email, phone, company, budget, zip,  message, quoteType } = req.body ;

        if(!fname || !lname || !email || !phone || !company || !budget || !zip || !message) return res.status(400).json({message: "All fields are required"})
        
        const existingEmail = await quoteSchema.findOne({email});
        if(existingEmail) return res.status(409).json({message: "Email already exists"});

        const quote = await quoteSchema.create({
            fname, lname, email, phone, message, company, budget, zip, document : req.file ? req.file.path : null , message, quoteType
        });

        if(!quote) return res.status(401).json({message: "quote data not found"});
        return res.status(201).json({message: "Quote created successfully"});

    } catch (error) {
        console.log(quoteSchema.email);
        res.status(500).json({message:"internal server error"});
        
    }
}

const getQuote = async (req, res) => {
    try{
      const quote = await quoteSchema.find();
      if(!quote) res.status(401).json({message: "Quotes not found"})
        return res.status(201).json(quote)
    }
    catch(err){
        console.log(err)
        res.status(500).json({message: "Internal server error"})
    }
}

const deleteQuote = async (req, res)=>{

    const id = req.params.id;
    try {
        if(!id) return res.status(404).json({message: "Quote not found"})
        const quoteDelete = await quoteSchema.findByIdAndDelete(id);
        if(quoteDelete) return res.status(404).json({message: "Quote not deleted"});
        return res.status(200).json({message: "Quote deleted successfully"})
        
    } catch (error) {
        console.log(error)
        res.status(500).json({message: "Internal server error"})
    }

}


module.exports = {
    addQuote, getQuote, deleteQuote, Upload
}