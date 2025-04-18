const express = require("express");
const router = express.Router()

const {verifyOTP} = require('../controllers/VerifyOTPController')

router.route("/verify").post(verifyOTP);


module.exports = router;