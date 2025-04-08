const express = require("express");
const router = express.Router();
const {addFAQ, getFAQ} = require("../controllers/FAQController")



router.get('/', getFAQ );
router.post('/', addFAQ);



module.exports = router