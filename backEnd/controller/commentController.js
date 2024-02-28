const asyncHandler = require("express-async-handler");
const { createCommentService, deleteCommentByUserIdService, updateCommentService, getCommentsByProductIdService } = require("../service/commentSerivce");

const createComment = asyncHandler(async (req, res) => {
    try {
        await createCommentService(req, res)
    }
    catch (error) {
        throw error
    }
})

const getCommentsByProductId = asyncHandler(async (req, res) => {
    try {
        await getCommentsByProductIdService(req, res)
    }
    catch (error) {
        throw error
    }
})

const updateComment = asyncHandler(async (req, res) => {
    try {
        await updateCommentService(req, res)
    }
    catch (error) {
        throw error
    }
})

const deleteCommentByUserId = asyncHandler(async (req, res) => {
    try {
        await deleteCommentByUserIdService(req, res)
    }
    catch (error) {
        throw error
    }
})


module.exports = {
    createComment,
    getCommentsByProductId,
    updateComment,
    deleteCommentByUserId
}