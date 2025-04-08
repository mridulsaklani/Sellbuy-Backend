const express = require("express");
const router = express.Router();
const {GetTestimonial, PostTestimonial} = require("../controllers/TestimonialController") 


router.get('/', GetTestimonial)
router.post("/", PostTestimonial)

module.exports = router