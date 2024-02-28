const { v4: uuidv4 } = require('uuid');
const { Op } = require("sequelize");
const { Rating, Comment } = require("../models/productModel");
const { CustomError } = require("../utils/CustomError");
const { getProductByConditionRepo, createProductRepo, getProductsByConditionRepo, filterProductsByConditionRepo, updateProductRepo, deleteProductRepo } = require("../repository/productRepository");

const createProductService = async (req, res) => {
    const { name } = req.body;
    const product = await getProductByConditionRepo({ where: { name: name }, include: [{ model: Rating, separate: true }, { model: Comment, separate: true }] })
    if (!product) {
        const newProduct = {
            productId: req.body.productId ? req.body.productId : uuidv4(),
            name: req.body.name,
            slug: req.body.slug,
            description: req.body.description,
            price: req.body.price,
            image: req.body.image,
            brand: req.body.brand,
            quantity: req.body.quantity,
            sold: req.body.sold,
            tags: req.body.tags,
            totalRating: req.body.totalRating,
            categoryId: req.body.categoryId
        }
        await createProductRepo(newProduct);
        res.sendStatus(200)
    } else {
        throw new CustomError("Sản phẩm này đã tồn tại!", 401)
    }
}

const getProductsService = async (req, res) => {
    try {
        const search = (req.query.search || '')
        const tag = (req.query.tag || '')
        const categoryId = (req.query.categoryId || '')
        let products = await getProductsByConditionRepo({ where: { name: { [Op.substring]: [search] }, tags: { [Op.substring]: [tag] }, categoryId: { [categoryId === '' ? Op.substring : Op.eq]: [categoryId] } }, include: [{ model: Rating, separate: true }, { model: Comment, separate: true }], });
        res.json(products)
    }
    catch (error) {
        throw new CustomError("Có lỗi xảy ra!", 500)
    }

}

const getProductService = async (req, res) => {
    if (!req.params.productId) {
        throw new CustomError("Định danh sản phẩm không tồn tại!", 404)
    }
    try {
        const { productId } = req.params
        const product = await getProductByConditionRepo({ where: { productId: productId }, include: [{ model: Rating, separate: true }, { model: Comment, separate: true }] });
        if (!product || product == null) {
            throw new CustomError("Sản phẩm này không tồn tại!", 404)
        }
        res.json(product)
    }
    catch (error) {
        throw error
    }
}

const getProductChatBotService = async (req, res) => {
    if (!req.body.name) {
        throw new CustomError("Định danh sản phẩm không tồn tại!", 404)
    }
    try {
        const { name } = req.body
        const product = await getProductByConditionRepo({ where: { name:{ [Op.substring]: [name]}} });
        if (!product || product == null) {
            throw new CustomError("Sản phẩm này không tồn tại!", 404)
        }
        res.json(product)
    }
    catch (error) {
        throw error
    }
}

const filterProductService = async (req, res) => {
    try {
        const page = parseInt((req.query.page || 1))
        const limit = parseInt((req.query.limit || 10));
        const sort = (req.query.sort || 'asc')
        const sortPrice = (req.query.sortPrice || 'asc')
        const categoryId = (req.query.categoryId || '')
        const search = (req.query.search || '')
        const tag = (req.query.tag || '')
        let products
        if (categoryId != '') {
            products = await filterProductsByConditionRepo({ where: { name: { [Op.substring]: [search] }, tags: { [Op.substring]: [tag] }, categoryId: { [Op.eq]: [categoryId] } }, offset: ((page - 1) * limit), limit: limit, order: [['name', sort], ['price', sortPrice]], subQuery: false, include: [{ model: Rating, separate: true }, { model: Comment, separate: true }] })
        }
        else {
            products = await filterProductsByConditionRepo({ where: { name: { [Op.substring]: [search] }, tags: { [Op.substring]: [tag] }, }, offset: ((page - 1) * limit), limit: limit, order: [['name', sort], ['price', sortPrice]], subQuery: false, include: [{ model: Rating, separate: true }, { model: Comment, separate: true }] })
        }
        res.json(products)
    }
    catch (error) {
        throw new CustomError("Có lỗi xảy ra!", 500)
    }

}

const updateProductService = async (req, res) => {
    if (!req.params.productId) {
        throw new CustomError("Định danh sản phẩm không tồn tại!", 404)
    }
    try {
        const { productId } = req.params
        const oldProduct = await getProductByConditionRepo({ where: { productId: productId }, include: [{ model: Rating, separate: true }, { model: Comment, separate: true }] })
        if (!oldProduct || oldProduct == null) {
            throw new CustomError("Sản phẩm này không tồn tại!", 404)
        }
        const newProduct = {
            name: req.body.name ? req.body.name : oldProduct.name,
            slug: req.body.slug ? req.body.slug : oldProduct.slug,
            description: req.body.description ? req.body.description : oldProduct.description,
            price: req.body.price ? req.body.price : oldProduct.price,
            image: req.body.image ? req.body.image : oldProduct.image,
            brand: req.body.brand ? req.body.brand : oldProduct.brand,
            quantity: req.body.quantity ? req.body.quantity : oldProduct.quantity,
            sold: req.body.sold ? req.body.sold : oldProduct.sold,
            tags: req.body.tags ? req.body.tags : oldProduct.tags,
            totalRating: req.body.totalRating ? req.body.totalRating : oldProduct.totalRating,
            categoryId: req.body.categoryId ? req.body.categoryId : oldProduct.categoryId
        }
        await updateProductRepo(newProduct, { where: { productId: productId }, include: [{ model: Rating, separate: true }, { model: Comment, separate: true }] })
        // res.json(resp)
        res.sendStatus(200)
    }
    catch (error) {
        throw error
    }
}

const deleteProductService = async (req, res) => {
    if (!req.params.productId) {
        throw new CustomError("Định danh sản phẩm không tồn tại!", 404)
    }
    try {
        const { productId } = req.params
        const product = await getProductByConditionRepo({ where: { productId: productId }, include: [{ model: Rating, separate: true }, { model: Comment, separate: true }] })
        if (!product || product == null) {
            throw new CustomError("Sản phẩm này không tồn tại!", 404)
        }
        await deleteProductRepo({ where: { productId: productId } })
        res.sendStatus(200)
    }
    catch (error) {
        throw error
    }
}

const checkProductExistService = async (name) => {
    const isExistProduct = await getProductByConditionRepo({ where: { name: name }, include: [{ model: Rating, separate: true }, { model: Comment, separate: true }] })
    if (isExistProduct != null && isExistProduct.productId) {
        return true
    }
    return false
}
const createProductFromExcelService = async (product) => {
    try {
        const newProduct = {
            productId: product.productId ? product.productId : uuidv4(),
            name: product.name,
            slug: product.slug,
            description: product.description,
            price: product.price,
            image: product.image,
            brand: product.brand,
            quantity: product.quantity,
            sold: product.sold,
            tags: product.tags,
            totalRating: product.totalRating,
            categoryId: product.categoryId
        }
        await createProductRepo(newProduct);
        return true
    }
    catch (error) {
        return false;
    }
}

module.exports = {
    createProductService,
    getProductsService,
    getProductService,
    filterProductService,
    updateProductService,
    deleteProductService,
    getProductChatBotService,
    checkProductExistService,
    createProductFromExcelService
}