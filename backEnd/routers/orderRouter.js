const express = require('express');
const router = express.Router()
const { authMiddleware, checkIsAdmin } = require('../middlewares/authMiddleware');
const { getOrders, createOrder, updataStatusOrder, updataStatusPayment, deleteOrders, getOrdersByUserId, getOrderByOrderId, deleteOrdersByUserId, deleteOrderbyOrderId, filterOrdersForDashboard, filterOrders, cancleStatusOrder } = require('../controller/orderController');

router.get("/orders", authMiddleware, checkIsAdmin, getOrders)
router.get("/orders-dashboard", authMiddleware, checkIsAdmin, filterOrdersForDashboard)
router.get("", authMiddleware, filterOrders)
router.get("/my-order", authMiddleware, getOrdersByUserId)
router.get("/detail-order/:orderId", authMiddleware, getOrderByOrderId)

router.post("/new-order", authMiddleware, createOrder)

router.put('/update-order/:orderId', authMiddleware, updataStatusOrder)
router.put('/cancle-order/:orderId', authMiddleware, cancleStatusOrder)
router.put('/update-payment-status/:orderId', authMiddleware, updataStatusPayment)

router.delete('', authMiddleware,checkIsAdmin, deleteOrders)
router.delete('/my-order', authMiddleware, deleteOrdersByUserId)
router.delete('/delete-order/:orderId', authMiddleware, deleteOrderbyOrderId)

module.exports = router;