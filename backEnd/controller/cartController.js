const asyncHandler = require("express-async-handler");
const { createCartService, getCartBelongToUserService, pushProductIntoCartService, deletProductIncartService, deleteCartService } = require("../service/cartService");

const createCart = asyncHandler(async (req, res) => {
    try{
        await createCartService(req, res)
    }
    catch(error){
        throw error
    }
})

const getCartBelongToUser = asyncHandler(async (req, res) => {
    try {
        await getCartBelongToUserService(req, res)
    }
    catch (error) {
        throw error
    }
})

const pushProductIntoCart = asyncHandler(async (req, res) => {
    try {
        await pushProductIntoCartService(req, res)
    }
    catch (error) {
        throw error
    }
})

const deletProductIncart = asyncHandler(async (req, res) => {
    try {
        await deletProductIncartService(req, res)
    }
    catch (error) {
        throw error
    }
})


const deleteCart = asyncHandler(async (req, res) => {
    try {
        await deleteCartService(req, res)
    }
    catch (error) {
        throw error
    }

})


module.exports = {
    createCart,
    pushProductIntoCart,
    deleteCart,
    getCartBelongToUser,
    deletProductIncart
}