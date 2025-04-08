const express = require("express");
const router = express.Router();
const {getUser,getSellerUser,addUser} = require("../controllers/RegisterUserController")


router.post('/', addUser);
router.get('/', getUser);
router.get("/supplier", getSellerUser);


module.exports = router