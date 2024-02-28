const express = require('express');
const router = express.Router()
const { createUser, loginUserCtrl, getAllUser, getUser, deleteUser, updateUser, logout, handleRefreshToken, updatePassword, forgetPasswordToken, resetPassword, updateInfoUserFirebase, createAdmin, loginAdminCtrl } = require('../controller/userController');
const { authMiddleware, checkIsAdmin } = require('../middlewares/authMiddleware');

router.post('/register', createUser)
router.post('/register-admin', createAdmin)
router.post('/login', loginUserCtrl)
router.post('/login-admin', loginAdminCtrl)
router.post('/forgot-password', forgetPasswordToken)

router.get('/logout', logout)
router.get('/users',authMiddleware, checkIsAdmin, getAllUser)

router.get('/refresh', authMiddleware, handleRefreshToken)
router.get('/:userId', authMiddleware, checkIsAdmin, getUser)

router.delete('/:userId', deleteUser)

router.put('/update-user', authMiddleware, updateUser)
// router.put('/update-user-firebase', updateInfoUserFirebase)
router.put('/update-password', authMiddleware, updatePassword)
router.put('/reset-password/:token', resetPassword)

module.exports = router;