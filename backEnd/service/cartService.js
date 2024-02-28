const { v4: uuidv4 } = require('uuid');
const { CustomError } = require("../utils/CustomError");
const { getCartByConditionRepo, createCartRepo, getProductsCartByConditionRepo, getProductCartByConditionRepo, createProductCartRepo, updateCartRepo, deleteProductCartByConditionRepo, deleteCartByConditionRepo } = require("../repository/cartRepository");
const { getProductByConditionRepo } = require("../repository/productRepository");

const createCartService = async (req, res) => {
    try{
        const user = req.user
        const oldCart = await getCartByConditionRepo({ where: { userId: user.userId } })
        if (oldCart) {
            await oldCart.destroy({ where: { cartId: oldCart.cartId } })
        }
        const newCart = {
            cartId: uuidv4(),
            cartTotal: 0,
            totalAfterDiscount: 0,
            userId: user.userId
        }
        const response = await createCartRepo(newCart)
        res.json({
            ...response.dataValues,
            productsCart: []
        })
    }
    catch(error){
        throw error
    }
}

const getCartBelongToUserService = async (req, res) => {
    try {
        const user = req.user
        const cart = await getCartByConditionRepo({ where: { userId: user.userId } })
        if (!cart) {
            throw new CustomError("Không tìm thấy giỏ hàng!", 204)
        }
        const productsBelongCart = await getProductsCartByConditionRepo({ where: { cartId: cart.cartId } })
        const productsCart = []
        for (const productCart of productsBelongCart) {
            const productOrigin = await getProductByConditionRepo({ where: { productId: productCart.productId }, raw: true, nest: true })
            const newProductCart = {
                ...productCart.dataValues,
                product: productOrigin
            }
            productsCart.push(newProductCart)
        }
        const response = {
            ...cart.dataValues,
            productsCart: productsCart
        }
        res.json(response)
    }
    catch (error) {
        throw error
    }
}

const pushProductIntoCartService = async (req, res) => {
    try {
        const { cartId } = req.body
        const cart = await getCartByConditionRepo({ where: { cartId: cartId } })
        if (!cart) {
            throw new CustomError("Không tìm thấy giỏ hàng!", 404)
        }
        const productCartExistIndex = await getProductCartByConditionRepo({ where: { cartId: cart.cartId, productId: req.body.productId } })
        const product = await getProductByConditionRepo({ where: { productId: req.body.productId } })

        if (!productCartExistIndex) {
            const newProductCart = {
                productCartId: uuidv4(),
                count: req.body.count,
                cartId: cart.cartId,
                productId: product.productId,
                note: req.body.note,
            }
            await createProductCartRepo(newProductCart)
            const newCartTotal = cart.cartTotal + (parseInt(req.body.count) * product.price)
            await updateCartRepo({ cartTotal: newCartTotal },{where: {cartId : cart.cartId}})
        }
        else {
            await productCartExistIndex.update({ count: (productCartExistIndex.count + req.body.count) })
            await updateCartRepo({ cartTotal: (cart.cartTotal + (req.body.count * product.price)) }, { where: { cartId: cart.cartId } })
        }
        res.sendStatus(200)
    }
    catch (error) {
        throw error
    }
}

const deletProductIncartService = async (req, res) => {
    try {
        const { productCartId } = req.params
        const productCart = await getProductCartByConditionRepo({ where: { productCartId: productCartId } })
        const product = await getProductByConditionRepo({ where: { productId: productCart.productId } })
        if (!productCart) {
            throw new CustomError("Sản phẩm này không tồn tại trong giỏ hàng!", 404)
        }
        const cart = await getCartByConditionRepo({ where: { userId: req.user.userId } })
        await updateCartRepo({ cartTotal: (cart.cartTotal - (productCart.count * product.price))},{ where: { userId: req.user.userId } })
        await deleteProductCartByConditionRepo({ where: { productCartId: productCartId } })
        res.sendStatus(200)
    }
    catch (error) {
        throw error
    }
}


const deleteCartService = async (req, res) => {
    try {
        const user = req.user
        await deleteCartByConditionRepo({ where: { userId: user.userId } })
        res.sendStatus(200)
    } catch (error) {
        throw new CustomError("Có lỗi xảy ra, vui lòng thử lại!", 500)
    }

}


module.exports = {
    createCartService,
    pushProductIntoCartService,
    deleteCartService,
    getCartBelongToUserService,
    deletProductIncartService
}