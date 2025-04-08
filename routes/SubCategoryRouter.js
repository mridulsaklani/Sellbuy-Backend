const {getSubCategory, getPaginatedSubCategory, addSubCategory, patchSubCategory, deleteSubCategory} = require('../controllers/SubCategoryController')
const express = require("express");
const router = express.Router()


router.get('/', getSubCategory)
router.get('/paginate', getPaginatedSubCategory)
router.post("/", addSubCategory)
router.patch("/:id", patchSubCategory)
router.delete("/:id", deleteSubCategory)

module.exports = router