const express = require("express");
const router = express.Router();
const {addRFQ, getAllRFQ, getRFQWithId, getLoggedUserRFQ, getRFQHistory, getApprovedRFQ, approvedRFQ, rejectRFQ, editRFQ, deleteRFQ} = require("../controllers/NewRFQController");
const Upload = require("../middlewares/multerConfig");
const verifyJWT = require("../middlewares/AuthMiddleware")

router.post("/", Upload.single('document'), addRFQ);
router.get("/all", getAllRFQ);
router.get("/single/:id", getRFQWithId);
router.get("/approved", verifyJWT, getApprovedRFQ)
router.get("/myrfqs", verifyJWT, getLoggedUserRFQ);
router.get("/history/:id", getRFQHistory);
router.patch("/approve/:id", approvedRFQ);
router.patch('/update/:id', editRFQ);
router.route("/reject/:id").patch(verifyJWT, rejectRFQ)
router.delete("/:id", deleteRFQ);


module.exports = router;