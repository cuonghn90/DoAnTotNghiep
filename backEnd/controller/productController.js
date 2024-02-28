const asyncHandler = require("express-async-handler");
const { createProductService, getProductsService, filterProductService, getProductService, updateProductService, deleteProductService, checkProductExistService, createProductFromExcelService, getProductChatBotService } = require("../service/productService");

const createProduct = asyncHandler(async (req, res) => {
    try{
        await createProductService(req, res)
    }
    catch(error){
        throw error
    }
})

const getProducts = asyncHandler(async (req, res) => {
    try {
        await getProductsService(req, res)
    }
    catch (error) {
        throw error
    }

})

const getProduct = asyncHandler(async (req, res) => {
    try {
        await getProductService(req, res)
    }
    catch (error) {
        throw error
    }
})

const getProductChatBot = asyncHandler(async (req, res) => {
    try {
        console.log(123);
        await getProductChatBotService(req, res)
    }
    catch (error) {
        throw error
    }
})

const filterProduct = asyncHandler(async (req, res) => {
    try {
        await filterProductService(req, res)
    }
    catch (error) {
        throw error
    }

})

const updateProduct = asyncHandler(async (req, res) => {
    try {
        await updateProductService(req, res)
    }
    catch (error) {
        throw error
    }
})

const deleteProduct = asyncHandler(async (req, res) => {
    try {
        await deleteProductService(req, res)
    }
    catch (error) {
        throw error
    }
})

const checkProductExist = async(name) => {
    return (await checkProductExistService(name))
}
const createProductFromExcel = async(product) => {
    return (await createProductFromExcelService(product))
}

module.exports = {
    createProduct,
    getProducts,
    getProduct,
    updateProduct,
    filterProduct,
    deleteProduct,
    getProductChatBot,
    checkProductExist,
    createProductFromExcel
}