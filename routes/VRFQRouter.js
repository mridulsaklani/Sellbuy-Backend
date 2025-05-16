const express = require("express");
const router = express.Router();

const { getAllVRFQ ,createVRFQ, getVRFQById, getVRFQByCreator, updateVRFQ, rejectingVRFQ, negotiateVRFQ} = require("../controllers/VRFQController")
const verifyJWT = require("../middlewares/AuthMiddleware")

router.route('/getall').get(verifyJWT, getAllVRFQ);
router.route("/getbyCreator").get(verifyJWT, getVRFQByCreator);
router.route("/getbyid/:id").get(verifyJWT, getVRFQById);
router.route("/add").post(verifyJWT, createVRFQ);
router.route("/update/:id").patch(verifyJWT, updateVRFQ)
router.route("/reject/:id").patch(verifyJWT, rejectingVRFQ);
router.route("/negotiate/:id").patch(verifyJWT, negotiateVRFQ)

module.exports = router