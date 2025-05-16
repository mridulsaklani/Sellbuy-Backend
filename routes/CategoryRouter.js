const express = require("express");
const router = express.Router();
const {addCategory, getCategories, getPaginatedCategories, deleteCategory, PatchCategory} = require("../controllers/CategoryController");
const verifyJWT = require("../middlewares/AuthMiddleware")


router.post("/", verifyJWT, addCategory);
router.get("/", getCategories);
router.get("/paginate", getPaginatedCategories);
router.delete("/:id", deleteCategory);
router.patch("/:id", PatchCategory)

module.exports = router