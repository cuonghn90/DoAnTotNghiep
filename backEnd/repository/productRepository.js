const { Product } = require("../models/productModel")

const getProductByConditionRepo = async(condition) => {
    try{
        const product = await Product.findOne(condition)
        return product
    }
    catch(error){
        throw error
    }
}

const createProductRepo = async (newProduct) => {
    try {
        const product = await Product.create(newProduct);
        return product
    }
    catch (error) {
        throw error
    }
}

const getProductsByConditionRepo = async(condition) => {
    try {
        const products = await Product.findAll(condition);
        return products
    }
    catch (error) {
        throw error
    }
}

const filterProductsByConditionRepo = async(condition) => {
    try {
        const products = await Product.findAll(condition);
        return products
    }
    catch (error) {
        throw error
    }
}

const updateProductRepo = async(newProduct,condition) => {
    try{
        const product = Product.update(newProduct, condition)
        return product
    }
    catch(error){
        throw error
    }
}

const deleteProductRepo = async(condition) => {
    try {
        await Product.destroy(condition)
    }
    catch (error) {
        throw error
    }
}

module.exports = { getProductByConditionRepo, getProductsByConditionRepo, createProductRepo, filterProductsByConditionRepo, updateProductRepo, deleteProductRepo }