const { categorySchema: Category } = require('../models/categoryModel');

const getCategoryByConditionRepo = async (condition) => {
    try {
        const category = await Category.findOne(condition)
        return category
    }
    catch (error) {
        throw error
    }
}

const createCategoryRepo = async (newCategory) => {
    try {
        const category = await Category.create(newCategory);
        return category
    }
    catch (error) {
        throw error
    }
}

const getCategorysByConditionRepo = async () => {
    try {
        const categorys = await Category.findAll();
        return categorys
    }
    catch (error) {
        throw error
    }
}

const getCategorysAndProductConditionRepo = async (condition) => {
    try {
        const categorys = await Category.findAll(condition);
        return categorys
    }
    catch (error) {
        throw error
    }
}

const updateCategoryRepo = async (newCategory, condition) => {
    try {
        const category = Category.update(newCategory, condition)
        return category
    }
    catch (error) {
        throw error
    }
}

const deleteCategoryRepo = async (condition) => {
    try {
        await Category.destroy(condition)
    }
    catch (error) {
        throw error
    }
}

module.exports = { getCategoryByConditionRepo, getCategorysByConditionRepo, createCategoryRepo, updateCategoryRepo, deleteCategoryRepo, getCategorysAndProductConditionRepo }