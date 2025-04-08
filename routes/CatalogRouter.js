const {addCatalog, getCatalog, getCatalogById, updateCatalog, deleteCatalog} = require('../controllers/CatalogController');

const express = require('express');
const router = express.Router();

router.get("/", getCatalog);
router.get("/:id", getCatalogById);
router.post('/', addCatalog);
router.patch('/:id', updateCatalog);
router.delete("/:id", deleteCatalog);

module.exports = router;