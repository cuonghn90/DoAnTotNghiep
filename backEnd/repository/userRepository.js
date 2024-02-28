const { User } = require("../models/userModel")
const { CustomError } = require("../utils/CustomError")

const createUserRepo = async(newUser) => {
    try{
        const user = await User.create(newUser);
        return user
    }
    catch(error){
        throw error
    }
}

const getUserByEmailRepo = async (email) => {
    const user = await User.findOne({ where: { email: email } })
    console.log(user);
    return user;
}

const getUserByUserIdRepo = async (userId) => {
    try{
        const user = await User.findOne({ where: { userId: userId } })
        if(!user || user == null){
            throw new CustomError("Không tìm thấy người dùng!", 404)
        }
        return user;
    }
    catch(error){
        throw error
    }
}

const getUserByConditionRepo= async(condition) => {
    try{
        const user = await User.findOne(condition)
        return user;
    }
    catch(error){
        throw error
    }
}

const getUsersRepo = async (condition) => {
    try {
        const users = await User.findAll(condition)
        if (!users || users == null) {
            throw new CustomError("Không tìm thấy người dùng!", 404)
        }
        return users;
    }
    catch (error) {
        throw error
    }
}

const checkMatchPasswordRepo = async (user, password) => {
    try {
        console.log(user);

        const isMatch = await user.isPasswordMatched(password)
        return isMatch
    }
    catch (error) {
        throw new CustomError("Sai mật khẩu.", 400)
    }
}

const updateUserRepo = async (userId, newUser) => {
    try {
        console.log(newUser, userId);
        await User.update(newUser, { where: { userId: userId } })
    }
    catch (error) {
        throw new CustomError("Cập nhật thông tin lỗi.", 400)
    }
}

const updateRefreshTokenRepo = async (user, refreshToken) => {
    try {
        await User.update({ refreshToken: refreshToken, passwordResetToken: '', passwordResetExpires: '' }, { where: { userId: user?.userId } })
    }
    catch (error) {
        throw new CustomError("Cập nhật refreshToken lỗi.", 400)
    }
}

const createPasswordResetTokenRepo = async(user) => {
    const token = await user.createPasswordResetToken()
    return token
}

const saveUserRepo = async(user) => {
    await user.save()
}

const deleteUserByConditionRepo = async(condition) => {
    try{
        await User.destroy({ where: condition })
    }
    catch(error){
        throw new Error(error)
    }
}

module.exports = { 
    getUserByEmailRepo, 
    checkMatchPasswordRepo, 
    updateRefreshTokenRepo, 
    updateUserRepo, 
    createUserRepo, 
    getUserByUserIdRepo, 
    getUsersRepo, 
    createPasswordResetTokenRepo, 
    saveUserRepo,
    getUserByConditionRepo,
    deleteUserByConditionRepo 
}