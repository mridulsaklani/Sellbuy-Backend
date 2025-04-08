const path = require("path");



const BuyerDetailProductTemplate = (req,res)=>{
    try {
        const filePath = path.join(process.cwd(), "public/files/specification.xlsx");
        res.download(filePath, "Specification.xlsx", (err)=>{
            if(err){
                console.error("Error downloading file:", err);
                res.status(500).json({message:"Error downloading file"});
            }
        } )
    } catch (error) {
        console.error(error);
        res.status(500).json({message: "Internal server error"});
    }
} 


const BuyerProductTemplate = (req, res) => {
    try {
        const filePath = path.join(process.cwd(), "public/files/Book.xlsx");

        res.download(filePath, "Book.xlsx", (err) => {
            if (err) {
                console.error("Error downloading file:", err);
                res.status(500).json({ message: "Error downloading file" });
            }
        });
    } catch (error) {
        console.error("Internal Server Error:", error);
        res.status(500).json({ message: "Internal server error" });
    }
};



module.exports = {BuyerProductTemplate, BuyerDetailProductTemplate};