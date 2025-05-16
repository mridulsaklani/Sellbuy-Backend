const {getSubCategory, getPaginatedSubCategory, getSubCategoryWithAssignedCategory, addSubCategory, patchSubCategory, deleteSubCategory} = require('../controllers/SubCategoryController');
const verifyJWT = require("../middlewares/AuthMiddleware")
const express = require("express");
const router = express.Router()


router.get('/', getSubCategory)
router.get('/paginate', getPaginatedSubCategory);
router.route('/by-category/:id').get(verifyJWT, getSubCategoryWithAssignedCategory);
router.post("/", addSubCategory)
router.patch("/:id", patchSubCategory)
router.delete("/:id", deleteSubCategory)

module.exports = router