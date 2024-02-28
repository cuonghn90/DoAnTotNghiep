const express = require('express');
const router = express.Router()
const { authMiddleware } = require('../middlewares/authMiddleware');
const { createComment, getCommentsByProductId, updateComment, deleteCommentByUserId } = require('../controller/commentController');

router.get("/:productId",getCommentsByProductId)

router.put("/", authMiddleware, updateComment)

router.post("/", authMiddleware, createComment)

router.delete("/", authMiddleware, deleteCommentByUserId)

module.exports = router;