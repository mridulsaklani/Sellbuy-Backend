const {addSpecification, getSpecification, getPaginatedSpecification, updateSpecification, deleteSpecification} = require('../controllers/SpecificationController')
const express = require('express');

const router = express.Router();


router.post('/', addSpecification);
router.get("/", getSpecification);
router.get('/paginate', getPaginatedSpecification)
router.patch("/:id", updateSpecification)
router.delete("/:id", deleteSpecification)

module.exports = router