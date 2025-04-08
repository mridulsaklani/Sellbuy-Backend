const express = require("express");
const router = express.Router();
const authController = require("../controllers/AuthController");
const verifyJWT = require('../middlewares/AuthMiddleware');

router.route('/verify-auth').get(verifyJWT, authController);

module.exports = router;