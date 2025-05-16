const {addCatalog, getPaginatedCatalog, getPaginatedCatalogForUsers, getCatalogById, updateCatalog, deleteCatalog} = require('../controllers/CatalogController');

const express = require('express');
const router = express.Router();
const verifyJWT = require("../middlewares/AuthMiddleware")
const upload = require("../middlewares/multerConfig")

router.get("/paginate", getPaginatedCatalog);
router.route("/user/paginate").get(verifyJWT, getPaginatedCatalogForUsers)
router.get("/:id", getCatalogById);
router.post('/', upload.single("condition"), addCatalog);
router.route('/update/:id').patch(verifyJWT, updateCatalog);
router.delete("/:id", deleteCatalog);

module.exports = router;