const express = require('express');

const router = express.Router();

const {getTotalOrderReceive, dailyOrderReceived, getAllOrder, getOrderHistory, getOrderById, getSupplierUserOrder, getBuyerUserOrder, getBuyerOrderHistory, getSupplierOrderHistory, generateOrder, getTotalOrderCount, updateOrderTracker, getOrderCountForSupplier, getSupplierOrderDeliverCount}= require('../controllers/OrderController.js');
const verifyJwt = require('../middlewares/AuthMiddleware.js')

router.route('/all-received').get(verifyJwt, getTotalOrderReceive)
router.route('/add').post(verifyJwt, generateOrder);
router.route('/getall').get(verifyJwt, getAllOrder);
router.route('/daily-order').get(verifyJwt, dailyOrderReceived)
router.route("/all-history").get(verifyJwt, getOrderHistory);
router.route("/buyer-order-history").get(verifyJwt, getBuyerOrderHistory);
router.route("/supplier-order-history").get(verifyJwt, getSupplierOrderHistory);
router.route('/getbyid/:id').get(verifyJwt, getOrderById);
router.route('/supplier-user-order').get(verifyJwt, getSupplierUserOrder);
router.route('/buyer-user-order').get(verifyJwt, getBuyerUserOrder);
router.route('/total-order').get(verifyJwt, getTotalOrderCount);
router.route("/update/:id").patch(verifyJwt, updateOrderTracker);
router.route('/supplier-order').get(verifyJwt, getOrderCountForSupplier)
router.route('/supplier-delivered-order-count').get(verifyJwt, getSupplierOrderDeliverCount)

module.exports = router;