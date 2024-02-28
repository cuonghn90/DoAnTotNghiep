const asyncHandler = require("express-async-handler");
const { CustomError } = require("../utils/CustomError");
const { userLoginService, userRegisterService, getUserByUserIdService, updateInfoUserFirebaseService, updateUserService, updatePasswordService, forgetPasswordTokenService, resetPasswordService, deleteUserService, logoutService, getUsersService } = require("../service/userService");

const createUser = asyncHandler(async (req, res) => {
    try {
        await userRegisterService(req, res, 'user')
    }
    catch (error) {
        throw error
    }
})

const createAdmin = asyncHandler(async (req, res) => {
    try {
        await userRegisterService(req, res, 'admin')
    }
    catch (error) {
        throw error
    }
})

const loginUserCtrl = asyncHandler(async (req, res) => {
    try {
        await userLoginService(req, res, 'user')
    }
    catch (error) {
        throw error
    }
});

const loginAdminCtrl = asyncHandler(async (req, res) => {
    try {
        await userLoginService(req, res, 'admin')
    }
    catch (error) {
        throw error
    }
});

const getAllUser = asyncHandler(async (req, res) => {
    try {
        await getUsersService(req, res)
    }
    catch (error) {
        throw new CustomError(error.message, 500)
    }
})


const getUser = asyncHandler(async (req, res) => {
    try {
        await getUserByUserIdService(req, res)
    }
    catch (error) {
        throw error
    }
})

const updateInfoUserFirebase = asyncHandler(async (req, res) => {
    try {
       await updateInfoUserFirebaseService(req, res)
    }
    catch (error) {
        throw error
    }
})

const updateUser = asyncHandler(async (req, res) => {
    try{
        await updateUserService(req, res)
    }
    catch(error){
        throw error
    }
})

const updatePassword = asyncHandler(async (req, res) => {
    try{
        await updatePasswordService(req, res)
    }
    catch(error){
        throw error
    }
})

const forgetPasswordToken = asyncHandler(async (req, res) => {
    try{
        await forgetPasswordTokenService(req, res)
    }
    catch(error){
        throw error
    }
})

const resetPassword = asyncHandler(async (req, res) => {
    try{
        await resetPasswordService(req, res)
    }
    catch(error){
        throw error
    }
})

const deleteUser = asyncHandler(async (req, res) => {
    try {
        await deleteUserService(req, res)
    }
    catch (error) {
        throw error;
    }
})

const handleRefreshToken = asyncHandler(async (req, res) => {
    const user = req.user;
    if (user.userId) {
        res.json(user)
    }
})

const logout = asyncHandler(async (req, res) => {
    try{
        await logoutService(req, res)
    }
    catch(error){
        throw error
    }
})

module.exports = {
    createUser,
    createAdmin,
    loginUserCtrl,
    loginAdminCtrl,
    getAllUser,
    getUser,
    updateUser,
    updateInfoUserFirebase,
    deleteUser,
    handleRefreshToken,
    logout,
    updatePassword,
    forgetPasswordToken,
    resetPassword
}