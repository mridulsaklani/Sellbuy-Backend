const express = require('express');
const router = express.Router();
const {BuyerProductTemplate, BuyerDetailProductTemplate} = require('../controllers/DownloadController')

router.get('/download-spec-sheet', BuyerProductTemplate);
router.get('/rfq-detail-sheet', BuyerDetailProductTemplate)

module.exports = router