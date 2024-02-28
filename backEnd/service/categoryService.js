const asyncHandler = require("express-async-handler");
const { v4: uuidv4 } = require('uuid');
const { validateMysql } = require("../utils/validateMysql");
const { categorySchema: Category } = require('../models/categoryModel');
const { CustomError } = require("../utils/CustomError");
const { Product } = require("../models/productModel");
const { getCategoryByConditionRepo, createCategoryRepo, getCategorysByConditionRepo, getCategorysAndProductConditionRepo, updateCategoryRepo, deleteCategoryRepo } = require("../repository/categoryRepository");

const createCategoryService = async (req, res) => {
    const { userId } = req.user
    const { name } = req.body
    validateMysql(userId)
    try {
        const checkCategoryExist = await getCategoryByConditionRepo({ where: { name: name } })
        if (!checkCategoryExist) {
            const category = {
                categoryId: uuidv4(),
                name: name
            }
            await createCategoryRepo(category)
            res.sendStatus(200)
        }
        else {
            throw new CustomError("Danh mục đã tồn tịa, vui lòng đổi tiêu đề danh mục!", 409)
        }
    }
    catch (error) {
        throw error
    }
}

const getCategorysService = async (req, res) => {
    try{
        const categorys = await getCategorysByConditionRepo()
        res.json(categorys)
    }
    catch(error){
        throw error
    }
}

const getCategoryService = async (req, res) => {
    try {
        const { categoryId } = req.params
        const category = await getCategoryByConditionRepo({ where: { categoryId: categoryId } })
        res.json(category)
    }
    catch (error) {
        throw error
    }
}


const getCategorysAndProductService = async (req, res) => {
    try{
        const categorys = await getCategorysAndProductConditionRepo({ include: Product })
        res.json(categorys)
    }
    catch(error){
        throw error
    }
}

const updateCategoryService = async (req, res) => {
    const { categoryId } = req.params
    const { name } = req.body
    try {
        const category = await getCategoryByConditionRepo({ where: { categoryId: categoryId } })
        if (!category) {
            throw new CustomError("Category is not exist", 404)
        }
        await updateCategoryRepo({ name: name }, { where: { categoryId: categoryId } })
        res.sendStatus(200)
    }
    catch (error) {
        throw error
    }
}


const deleteCategoryService = async (req, res) => {
    const { categoryId } = req.params
    try {
        const category = await getCategoryByConditionRepo({ where: { categoryId: categoryId } })
        if (!category) {
            throw new CustomError("Category is not exist", 404)
        }
        await deleteCategoryRepo({ where: { categoryId: categoryId } })
        res.sendStatus(200)
    }
    catch (error) {
        throw error
    }
}

const checkIsCategoryService = async (category) => {
    const isExistCategory = await getCategoryByConditionRepo({ where: { categoryId: category } })
    if (isExistCategory != null && isExistCategory.categoryId) {
        return true
    }
    return false
}


module.exports = {
    createCategoryService,
    getCategorysService,
    getCategoryService,
    getCategorysAndProductService,
    updateCategoryService,
    deleteCategoryService,
    checkIsCategoryService
}