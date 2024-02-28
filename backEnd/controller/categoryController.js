const asyncHandler = require("express-async-handler");
const { createCategoryService, checkIsCategoryService, deleteCategoryService, updateCategoryService, getCategorysAndProductService, getCategoryService, getCategorysService } = require("../service/categoryService");

const createCategory = asyncHandler(async (req, res) => {
    try {
        await createCategoryService(req, res)
    }
    catch (error) {
        throw error
    }
})

const getCategorys = asyncHandler(async (req, res) => {
    try {
        await getCategorysService(req, res)
    }
    catch (error) {
        throw error
    }
})

const getCategory = asyncHandler(async (req, res) => {
    try {
        await getCategoryService(req, res)
    }
    catch (error) {
        throw error
    }
})


const getCategorysAndProduct = asyncHandler(async (req, res) => {
    try {
        await getCategorysAndProductService(req, res)
    }
    catch (error) {
        throw error
    }
})

const updateCategory = asyncHandler(async (req, res) => {
    try {
        await updateCategoryService(req, res)
    }
    catch (error) {
        throw error
    }
})


const deleteCategory = asyncHandler(async (req, res) => {
    try {
        await deleteCategoryService(req, res)
    }
    catch (error) {
        throw error
    }
})

const checkIsCategory = async (category) => {
    return (await checkIsCategoryService(category))
}


module.exports = {
    createCategory,
    getCategorys,
    getCategory,
    getCategorysAndProduct,
    updateCategory,
    deleteCategory,
    checkIsCategory
}