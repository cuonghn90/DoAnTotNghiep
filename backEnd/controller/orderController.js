const asyncHandler = require("express-async-handler");
const { createOrderService, deleteOrdersService, deleteOrdersByUserIdService, deleteOrderbyOrderIdService, getOrderByOrderIdService, getOrdersByUserIdService, filterOrdersForDashboardService, filterOrdersService, getOrdersService, updataStatusPaymentService, updataStatusOrderService, cancleStatusOrderService } = require("../service/orderService");

const createOrder = asyncHandler(async (req, res) => {
    try {
        await createOrderService(req, res)
    }
    catch (error) {
        throw error
    }
})

const updataStatusOrder = asyncHandler(async (req, res) => {
    try {
        await updataStatusOrderService(req, res)
    }
    catch (error) {
        throw error
    }
})
const cancleStatusOrder = asyncHandler(async (req, res) => {
    try {
        await cancleStatusOrderService(req, res)
    }
    catch (error) {
        throw error
    }
})

const updataStatusPayment = asyncHandler(async (req, res) => {
    try {
        await updataStatusPaymentService(req, res)
    }
    catch (error) {
        throw error
    }
})

const getOrders = asyncHandler(async (req, res) => {
    try {
        await getOrdersService(req, res)
    }
    catch (error) {
        throw error
    }
})

const filterOrders = asyncHandler(async (req, res) => {
    try {
        await filterOrdersService(req, res)
    }
    catch (error) {
        throw error
    }
})

const filterOrdersForDashboard = asyncHandler(async (req, res) => {
    try {
        await filterOrdersForDashboardService(req, res)
    }
    catch (error) {
        throw error
    }
})

const getOrdersByUserId = asyncHandler(async (req, res) => {
    try {
        await getOrdersByUserIdService(req, res)
    }
    catch (error) {
        throw error
    }
})

const getOrderByOrderId = asyncHandler(async (req, res) => {
    try {
        await getOrderByOrderIdService(req, res)
    }
    catch (error) {
        throw error
    }
})

const deleteOrderbyOrderId = asyncHandler(async (req, res) => {
    try {
        await deleteOrderbyOrderIdService(req, res)
    }
    catch (error) {
        throw error
    }
})

const deleteOrdersByUserId = asyncHandler(async (req, res) => {
    try {
        await deleteOrdersByUserIdService(req, res)
    }
    catch (error) {
        throw error
    }
})

const deleteOrders = asyncHandler(async (req, res) => {
    try {
        await deleteOrdersService(req, res)
    }
    catch (error) {
        throw error
    }
})
module.exports = {
    createOrder,
    getOrders,
    getOrdersByUserId,
    getOrderByOrderId,
    filterOrders,
    filterOrdersForDashboard,
    updataStatusOrder,
    cancleStatusOrder,
    updataStatusPayment,
    deleteOrders,
    deleteOrderbyOrderId,
    deleteOrdersByUserId
}