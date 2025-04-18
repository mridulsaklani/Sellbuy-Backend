const express = require("express");
const router = express.Router();

const verifyJWT = require("../middlewares/AuthMiddleware")

const {addAssigned, getAssignedBRFQbySupplier, getAssignedBRFQbyId} = require("../controllers/AssignedBRFQController");

router.route("/add").post(addAssigned);
router.route('/getbysupplier').get(verifyJWT, getAssignedBRFQbySupplier);
router.route("/getbyid/:id").get(verifyJWT, getAssignedBRFQbyId);

module.exports = router