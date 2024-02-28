const { cartSchema: Cart, productCartSchema: ProductCart } = require('../models/cartModel');

const createCartRepo = async (newCart) => {
    try {
        const cart = await Cart.create(newCart)
        return cart
    }
    catch (error) {
        throw error
    }
}

const getCartByConditionRepo = async(condition) => {
    try{
        const cart = await Cart.findOne(condition)
        return cart
    }
    catch(error){
        throw error
    }
}

const updateCartRepo = async(newCart,condition) => {
    try{
        const cart = await Cart.update(newCart,condition)
        return cart
    }
    catch(error){
        throw error
    }
}

const deleteCartByConditionRepo = async(condition) => {
    try{
        await Cart.destroy(condition)
    }
    catch(error){
        throw error
    }
}


const createProductCartRepo = async (newProductCart) => {
    try {
        const productCart = await ProductCart.create(newProductCart)
        return productCart
    }
    catch (error) {
        throw error
    }
}

const getProductsCartByConditionRepo = async(condition) => {
    try {
        const productsCart = await ProductCart.findAll(condition)
        return productsCart
    }
    catch (error) {
        throw error
    }
}

const getProductCartByConditionRepo = async(condition) => {
    try {
        const productCart = await ProductCart.findOne(condition)
        return productCart
    }
    catch (error) {
        throw error
    }
}

const deleteProductCartByConditionRepo = async (condition) => {
    try {
        await ProductCart.destroy(condition)
    }
    catch (error) {
        throw error
    }
}

module.exports = { createCartRepo, getCartByConditionRepo,
    updateCartRepo, deleteCartByConditionRepo, 
    getProductsCartByConditionRepo, getProductCartByConditionRepo,
    createProductCartRepo, deleteProductCartByConditionRepo }