const express = require('express');
const router = express.Router();
const {getUser, getSingleUser, buyerUser, supplierUser,verifyOTP, getUsersQuantity, loginUser, logoutUser, refreshAccessToken, changePassword, addUser, updateUser, userVerificationForgotPassword, verifyOTPForgetPassword, changePasswordForget, deleteUser} = require('../controllers/UserController')

const verifyJWT = require("../middlewares/AuthMiddleware");


router.route('/register').post(addUser);
router.route('/users').get(verifyJWT, getUser);
router.route("/profile").get(verifyJWT, getSingleUser);
router.route("/buyer").get(verifyJWT,buyerUser);
router.route('/supplier').get(verifyJWT,supplierUser);
router.route('/quantity').get(verifyJWT,getUsersQuantity);
router.route('/verify-otp').post(verifyOTP);
router.route('/login').post(loginUser);
router.route("/logout").post(verifyJWT, logoutUser);
router.route('/change-password').patch(verifyJWT, changePassword);
router.route("/refresh-token", refreshAccessToken);
router.route('/delete/:id').delete(verifyJWT,deleteUser);
router.route('/forget-password').post(userVerificationForgotPassword)
router.route("/password-verify-otp").post(verifyOTPForgetPassword);
router.route("/change-password-forget").patch(verifyJWT, changePasswordForget)
router.route("/update").patch(verifyJWT, updateUser)


module.exports = router;