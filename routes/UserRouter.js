const express = require('express');
const router = express.Router();
const {getUser, getSingleUser, buyerUser, supplierUser, getUsersQuantity, loginUser, logoutUser, refreshAccessToken, changePassword, addUser, updateUser, deleteUser} = require('../controllers/UserController')

const verifyJWT = require("../middlewares/AuthMiddleware");



router.route('/register').post(addUser);
router.route('/users').get( getUser);
router.route("/profile").get(verifyJWT, getSingleUser);
router.route("/buyer").get(buyerUser);
router.route('/supplier').get(supplierUser);
router.route('/quantity').get(getUsersQuantity);
router.route('/login').post(loginUser);
router.route("/logout").post(verifyJWT, logoutUser);
router.route('/change-password').post(verifyJWT, changePassword);
router.route("/refresh-token", refreshAccessToken);
router.route('/delete/:id').delete(deleteUser);
router.route("/update").patch(verifyJWT, updateUser)


module.exports = router;