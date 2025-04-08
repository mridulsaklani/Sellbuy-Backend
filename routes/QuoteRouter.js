const express = require("express");
const router = express.Router();
const {addQuote, getQuote, deleteQuote, Upload} = require("../controllers/quoteController");


router.post("/", Upload.single('document'), addQuote);
router.get("/", getQuote);
router.delete("/:id", deleteQuote)



module.exports = router




