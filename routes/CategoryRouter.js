const express = require("express");
const router = express.Router();
const {addCategory, getCategories, getPaginatedCategories, deleteCategory, PatchCategory} = require("../controllers/CategoryController")


router.post("/", addCategory);
router.get("/", getCategories);
router.get("/paginate", getPaginatedCategories);
router.delete("/:id", deleteCategory);
router.patch("/:id", PatchCategory)

module.exports = router