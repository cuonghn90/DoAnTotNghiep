const { orderSchema: Order, productOrderSchema: ProductOrder } = require('../models/orderModel');

const createOrderRepo = async (newOrder) => {
    try {
        const order = await Order.create(newOrder)
        return order
    }
    catch (error) {
        throw error
    }
}

const getOrderByConditionRepo = async (condition) => {
    try {
        const order = await Order.findOne(condition)
        return order
    }
    catch (error) {
        throw error
    }
}

const getOrdersByConditionRepo = async (condition) => {
    try {
        const order = await Order.findAll(condition)
        return order
    }
    catch (error) {
        throw error
    }
}

const updateOrderRepo = async (newOrder, condition) => {
    try {
        const order = await Order.update(newOrder, condition)
        return order
    }
    catch (error) {
        throw error
    }
}

const deleteOrderByConditionRepo = async (condition) => {
    try {
        await Order.destroy(condition)
    }
    catch (error) {
        throw error
    }
}


const createProductOrderRepo = async (newProductOrder) => {
    try {
        const productOrder = await ProductOrder.create(newProductOrder)
        return productOrder
    }
    catch (error) {
        throw error
    }
}

const getProductsOrderByConditionRepo = async (condition) => {
    try {
        const productsOrder = await ProductOrder.findAll(condition)
        return productsOrder
    }
    catch (error) {
        throw error
    }
}

const getProductOrderByConditionRepo = async (condition) => {
    try {
        const productOrder = await ProductOrder.findOne(condition)
        return productOrder
    }
    catch (error) {
        throw error
    }
}

const deleteProductOrderByConditionRepo = async (condition) => {
    try {
        await ProductOrder.destroy(condition)
    }
    catch (error) {
        throw error
    }
}

module.exports = {
    createOrderRepo, getOrderByConditionRepo,
    updateOrderRepo, deleteOrderByConditionRepo,
    getProductsOrderByConditionRepo, getProductOrderByConditionRepo,
    createProductOrderRepo, deleteProductOrderByConditionRepo,
    getOrdersByConditionRepo
}