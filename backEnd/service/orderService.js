const asyncHandler = require("express-async-handler");
const { v4: uuidv4 } = require('uuid');
const { Op } = require("sequelize");
const { validateMysql } = require("../utils/validateMysql");
const { Product } = require('../models/productModel');
const { orderSchema: Order, productOrderSchema: ProductOrder } = require('../models/orderModel');
const { cartSchema: Cart, productCartSchema: ProductCart } = require("../models/cartModel");
const { CustomError } = require("../utils/CustomError");
const { getCartByConditionRepo, getProductsCartByConditionRepo, deleteCartByConditionRepo } = require("../repository/cartRepository");
const { createOrderRepo, createProductOrderRepo, getOrderByConditionRepo, updateOrderRepo, getOrdersByConditionRepo, getProductsOrderByConditionRepo, deleteOrderByConditionRepo } = require("../repository/orderRepository");
const { getProductByConditionRepo } = require("../repository/productRepository");
const { getUserByConditionRepo } = require("../repository/userRepository");
const { getCouponRepo, checkCouponUsedExistRepo, createCouponUsedRepo } = require("../repository/couponRepository");

const createOrderService = async (req, res) => {
    try {
        const user = req.user
        const cartBelongToUser = await getCartByConditionRepo({ where: { userId: user.userId }, include: { model: ProductCart, separate: true } })
        const productBelongToCart = await getProductsCartByConditionRepo({ where: { cartId: cartBelongToUser.cartId } })
        const order = {
            orderId: uuidv4(),
            paymentMethod: req.body.paymentMethod,
            paymentAmount: cartBelongToUser.cartTotal,
            paymentAmountAfterDiscount: req.body.paymentAmountAfterDiscount,
            paymentStatus: req.body.isPay == 'true' ? 'Paid' : 'Unpaid',
            paymentCreate: Date.now(),
            userId: user.userId,
            addressShip: req.body.address,
            phoneShip: req.body.phone,
            isPay: req.body.isPay,
            orderIdPaypal: req.body.orderIdPaypal ? req.body.orderIdPaypal : ''
        }
        if (req.body.couponCode && req.body.couponCode != '') {
            const coupon = await getCouponRepo({ where: { couponCode: req.body.couponCode } })
            if (!coupon || coupon == null) {
                throw new CustomError("Mã giảm giá không tồn tại. Vui lòng xem lại.",400)
            }
            else{
                const couponUsed = await checkCouponUsedExistRepo({where: {userId: req.user.userId, couponId: coupon.couponId}})
                if(!couponUsed){
                    order.couponCode = req.body.couponCode
                    await createCouponUsedRepo({
                        couponId: coupon.couponId,
                        userId: req.user.userId
                    })
                }
                else{
                    throw new CustomError("Bạn đã sử dụng mã giảm giá này rồi.", 400)
                }
            }
        }
        await createOrderRepo(order)
        for (const productCart of productBelongToCart) {
            let productOrder = {
                productOrderId: uuidv4(),
                count: productCart.count,
                productId: productCart.productId,
                orderId: order.orderId,
                note: productCart.note,
            }
            await createProductOrderRepo(productOrder)
            const oldProduct = await getProductByConditionRepo({ where: { productId: productOrder.productId } })
            await Product.update({ sold: (oldProduct.sold + productOrder.count), quantity: (oldProduct.quantity - productOrder.count) }, { where: { productId: productCart.productId } })
        }

        const newOrder = await getOrderByConditionRepo({ where: { orderId: order.orderId }, include: { model: ProductOrder, separate: true } })
        await deleteCartByConditionRepo({ where: { userId: user.userId } })
        const response = {
            ...newOrder.dataValues
        }
        res.json(response)
    }
    catch (error) {
        throw new CustomError("Có lỗi xảy ra, vui lòng thử lại!", 500)
    }
}

const updataStatusOrderService = async (req, res) => {
    const { newStatus } = req.body
    const { orderId } = req.params
    try {
        await getOrderByConditionRepo({ where: { orderId: orderId } })
        await updateOrderRepo({ orderStatus: newStatus }, { where: { orderId: orderId } })
        res.sendStatus(200)
    }
    catch (error) {
        throw new CustomError("Có lỗi xảy ra, vui lòng thử lại!", 500)
    }
}

const cancleStatusOrderService = async (req, res) => {
    const { newStatus } = req.body
    const { orderId } = req.params
    const { userId } = req.user
    try {
        const order = await getOrderByConditionRepo({ where: { orderId: orderId, userId: userId } })
        if (order.orderStatus != 'Unconfimred' && order.orderStatus != 'Cancelled'){
            throw new CustomError("Đơn hàng đã được xác nhận, không thể hủy đơn",400)
        }
        await updateOrderRepo({ orderStatus: newStatus }, { where: { orderId: order.orderId } })
        res.sendStatus(200)
    }
    catch (error) {
        throw error
    }
}

const updataStatusPaymentService = async (req, res) => {
    const { newStatus } = req.body
    const { orderId } = req.params
    try {
        await getOrderByConditionRepo({ where: { orderId: orderId } })
        await updateOrderRepo({ paymentStatus: newStatus }, { where: { orderId: orderId } })
        res.sendStatus(200)
    }
    catch (error) {
        throw new CustomError("Có lỗi xảy ra, vui lòng thử lại!", 500)
    }
}

const getOrdersService = async (req, res) => {
    try {
        const search = (req.query.search || '')
        const status = (req.query.status || '')
        const orders = await getOrdersByConditionRepo({ where: { orderStatus: { [status === '' ? Op.substring : Op.eq]: [status] } }, include: [{ model: ProductOrder, separate: true }] })
        const dataResponse = []
        for (const order of orders) {
            const userOfOrder = await getUserByConditionRepo({ where: { userId: order.userId, username: { [Op.substring]: [search] } } })
            if (userOfOrder != null) {
                dataResponse.push({
                    ...order.dataValues,
                    user: {
                        userId: userOfOrder.userId,
                        username: userOfOrder.username,
                        firstname: userOfOrder.firstname,
                        lastname: userOfOrder.lastname,
                        email: userOfOrder.email,
                        phone: userOfOrder.phone,
                        avatar: userOfOrder.avatar,
                        userIdFirebase: userOfOrder.userIdFirebase
                    }
                })
            }
        }
        const response = {
            orders: dataResponse
        }
        res.json(response)
    }
    catch (error) {
        throw new CustomError("Có lỗi xảy ra, vui lòng thử lại!", 500)
    }
}

const filterOrdersService = async (req, res) => {
    try {
        const user = req.user
        const page = parseInt((req.query.page || 1))
        const limit = parseInt((req.query.limit || 10));
        const sort = (req.query.sort || 'desc')
        const status = (req.query.status || '')
        const search = (req.query.search || '')
        let orders
        if (user.role == 'admin') {
            orders = await getOrdersByConditionRepo({ where: { paymentStatus: { [status === '' ? Op.substring : Op.eq]: [status] } }, offset: ((page - 1) * limit), limit: limit, order: [['createdAt', sort]], subQuery: false, include: [{ model: ProductOrder, separate: true }] })
        }
        if (user.role == 'user') {
            orders = await getOrdersByConditionRepo({ where: { userId: user.userId, id: { [Op.substring]: [search] } }, offset: ((page - 1) * limit), limit: limit, order: [['createdAt', sort]], subQuery: false, include: [{ model: ProductOrder, separate: true }] })
        }
        const dataResponse = []
        for (const order of orders) {
            const userOfOrder = user.role === 'admin' ? await getUserByConditionRepo({ where: { userId: order.userId, username: { [Op.substring]: [search] } } })
                : await getUserByConditionRepo({ where: { userId: order.userId } })
            if (userOfOrder != null) {
                dataResponse.push({
                    ...order.dataValues,
                    user: {
                        userId: userOfOrder.userId,
                        username: userOfOrder.username,
                        firstname: userOfOrder.firstname,
                        lastname: userOfOrder.lastname,
                        email: userOfOrder.email,
                        phone: userOfOrder.phone,
                        avatar: userOfOrder.avatar,
                        userIdFirebase: userOfOrder.userIdFirebase
                    }
                })
            }
        }
        const response = {
            orders: dataResponse
        }
        res.json(response)
    }
    catch (error) {
        throw new CustomError("Có lỗi xảy ra!", 500)
    }
}

const filterOrdersForDashboardService = async (req, res) => {
    try {
        const page = parseInt((req.query.page || 1))
        const limit = parseInt((req.query.limit || 10));
        const sort = (req.query.sort || 'desc')
        const startDate = (req.query.startDate || '')
        const endDate = (req.query.endDate || '')
        let orders = await getOrdersByConditionRepo({ where: { createdAt: { [Op.between]: [startDate, endDate] } }, offset: ((page - 1) * limit), limit: limit, order: [['createdAt', sort]], subQuery: false, include: [{ model: ProductOrder, separate: true }] })
        const dataResponse = []
        const productPopular = {}
        for (const order of orders) {
            const userOfOrder = await getUserByConditionRepo({ where: { userId: order.userId } })
            if (userOfOrder != null) {
                dataResponse.push({
                    ...order.dataValues,
                    user: {
                        userId: userOfOrder.userId,
                        username: userOfOrder.username,
                        firstname: userOfOrder.firstname,
                        lastname: userOfOrder.lastname,
                        email: userOfOrder.email,
                        phone: userOfOrder.phone,
                        avatar: userOfOrder.avatar,
                        userIdFirebase: userOfOrder.userIdFirebase
                    }
                })
            }
            for (const productOrder of order.productsorders){
                if (productPopular[productOrder.productId]){
                    productPopular[productOrder.productId] = {
                        ...productPopular[productOrder.productId],
                        count: productPopular[productOrder.productId].count + productOrder.count,
                        totalMoney: productPopular[productOrder.productId].totalMoney + (productOrder.count * productPopular[productOrder.productId].price)
                    }
                }
                else{
                    const product = await getProductByConditionRepo({ where: { productId: productOrder.productId }})
                    productPopular[productOrder.productId] = {
                        name: product.name,
                        count: productOrder.count,
                        price: product.price,
                        totalMoney: productOrder.count * product.price
                    }
                }
                
            }
        }
        const dataProductPopularResponse = []
        for (const [key, value] of Object.entries(productPopular)) {
            dataProductPopularResponse.push(value)
        }
        const response = {
            orders: dataResponse,
            productsPopular: dataProductPopularResponse
        }
        res.json(response)
    }
    catch (error) {
        throw new CustomError("Có lỗi xảy ra!", 500)
    }
}

const getOrdersByUserIdService = async (req, res) => {
    try {
        const { userId } = req.user
        const search = (req.query.search || '')
        const ordersBelongToUser = await getOrdersByConditionRepo({ where: { userId: userId, id: { [Op.substring]: [search] } }, include: [{ model: ProductOrder, separate: true }] })
        const dataResponse = []
        for (const order of ordersBelongToUser) {
            const userOfOrder = await getUserByConditionRepo({ where: { userId: order.userId } })
            dataResponse.push({
                ...order.dataValues,
                user: {
                    userId: userOfOrder.userId,
                    username: userOfOrder.username,
                    firstname: userOfOrder.firstname,
                    lastname: userOfOrder.lastname,
                    email: userOfOrder.email,
                    phone: userOfOrder.phone,
                    avatar: userOfOrder.avatar
                }
            })
        }
        const response = {
            orders: ordersBelongToUser
        }
        res.json(response)
    }
    catch (error) {
        throw new CustomError("Có lỗi xảy ra, vui lòng thử lại!", 500)
    }
}

const getOrderByOrderIdService = async (req, res) => {
    try {
        const { orderId } = req.params
        const order = await getOrderByConditionRepo({ where: { orderId: orderId } })
        if (!order) {
            throw new CustomError("Có lỗi xảy ra, vui lòng thử lại!", 500)
        }
        const coupon = await getCouponRepo({ where: { couponCode: order.couponCode }, attributes: ['couponCode', 'discount', 'discountFor'] })
        const productsBelongOrder = await getProductsOrderByConditionRepo({ where: { orderId: order.orderId } })
        const productsOrder = []
        for (const productOrder of productsBelongOrder) {
            const productOrigin = await getProductByConditionRepo({ where: { productId: productOrder.productId }, raw: true, nest: true })
            const newProductCart = {
                ...productOrder.dataValues,
                product: productOrigin
            }
            productsOrder.push(newProductCart)
        }
        const response = {
            ...order.dataValues,
            productsOrder: productsOrder,
            couponUsed: coupon
        }
        res.json(response)
    }
    catch (error) {
        throw error
    }
}

const deleteOrderbyOrderIdService = async (req, res) => {
    try {
        const { orderId } = req.params
        const order = await getOrderByConditionRepo({ where: { orderId: orderId } })
        if (!order) {
            throw new CustomError("Hóa đơn không tồn tại vui lòng thử lại!", 400)
        }
        if (order.orderStatus != 'Cancelled' && order.orderStatus != 'Delivered' && order.orderStatus != 'Unconfimred')
        {
            throw new CustomError("Đơn hàng đang được xử lí, không thể xóa.", 400)
        }
        await deleteOrderByConditionRepo({ where: { orderId: order.orderId } })
        res.sendStatus(200)
    }
    catch (error) {
        throw error
    }
}

const deleteOrdersByUserIdService = async (req, res) => {
    try {
        const { userId } = req.user
        await deleteOrderByConditionRepo({ where: { userId: userId } })
        res.sendStatus(200)
    }
    catch (error) {
        throw new CustomError("Có lỗi xảy ra, vui lòng thử lại!", 500)
    }
}

const deleteOrdersService = async (req, res) => {
    try {
        await deleteOrderByConditionRepo({
            where: {},
            truncate: { cascade: true }
        })
        res.sendStatus(200)
    }
    catch (error) {
        throw new CustomError("Có lỗi xảy ra, vui lòng thử lại!", 500)
    }
}

module.exports = {
    createOrderService,
    getOrdersService,
    getOrdersByUserIdService,
    getOrderByOrderIdService,
    filterOrdersService,
    filterOrdersForDashboardService,
    updataStatusOrderService,
    cancleStatusOrderService,
    updataStatusPaymentService,
    deleteOrdersService,
    deleteOrderbyOrderIdService,
    deleteOrdersByUserIdService
}