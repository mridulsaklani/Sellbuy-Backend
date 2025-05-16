const express = require('express');
const router = express.Router();
const {getAllBRFQ, getBRFQById} = require("../controllers/BRFQController");
const verifyJWT = require("../middlewares/AuthMiddleware")

router.route("/all").get(getAllBRFQ);
router.route("/single/:id").get(verifyJWT, getBRFQById);

module.exports = router