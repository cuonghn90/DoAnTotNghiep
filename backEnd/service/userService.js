const { generateToken } = require("../config/jwtToken");
const { generateRefreshToken } = require("../config/refreshToken");
const { sendEmail } = require("../controller/emailController");
const { getUserByEmailRepo, checkMatchPasswordRepo, updateRefreshTokenRepo, createUserRepo, getUserByUserIdRepo, getUsersRepo, updateUserRepo, createPasswordResetTokenRepo, saveUserRepo, getUserByConditionRepo, deleteUserByConditionRepo } = require("../repository/userRepository");
const { CustomError } = require("../utils/CustomError");
const { v4: uuidv4 } = require('uuid');
const crypto = require("crypto")
const { Op } = require("sequelize")

const userRegisterService = async (req, res, role) => {
    if (!req.body.email || !req.body.username || !req.body.phone || !req.body.password) {
        throw new CustomError("Vui lòng điền đầy đủ thông tin!", 400)
    }
    const email = req.body.email;
    const findUser = await getUserByEmailRepo(email)
    if (!findUser) {
        const tempUser = {
            username: req.body.username,
            email: req.body.email,
            password: req.body.password,
            userId: uuidv4(),
            phone: req.body.phone,
            role: role,
            avatar: req.body.avatar
        }
        await createUserRepo(tempUser);
        res.json({
            userId: tempUser.userId
        })
    }
    else {
        throw new CustomError("Tài khoản này đã tồn tại!", 409)
    }
}

const userLoginService = async (req, res, role) => {
    if (!req.body.email || !req.body.password) {
        throw new CustomError("Vui lòng điền đầy đủ thông tin!", 400)
    }
    const { email, password } = req.body;
    const findUser = await getUserByEmailRepo(email)
    console.log(findUser);
    if (findUser && (await checkMatchPasswordRepo(findUser, password)) && findUser.role === role) {
        const refreshToken = generateRefreshToken(findUser?.userId)
        await updateRefreshTokenRepo(findUser, refreshToken)
        res.cookie("refreshToken", refreshToken, {
            httpOnly: true,
            maxAge: 72 * 60 * 60 * 1000,
            secure: false
        },).json({
            username: findUser?.username,
            email: findUser?.email,
            token: generateToken(findUser?.userId),
            userId: findUser?.userId,
            phone: findUser?.phone,
            firstname: findUser?.firstname,
            lastname: findUser?.lastname,
            avatar: findUser?.avatar,
        })
    }
    else {
        throw new CustomError("Thông tin tài khoản hoặc mật khẩu không chính xác!", 401)
    }
}

const getUserByUserIdService = async (req, res) => {
    try {
        if (!req.params.userId) {
            throw new CustomError("Mã định danh người dùng không chính xác!", 400)
        }
        const user = await getUserByUserIdRepo(req.params.userId)
        res.json({
            user,
        })
    }
    catch (error) {
        throw error
    }
}

const getUsersService = async (req, res) => {
    try {
        const role = req.query.role
        const users = await getUsersRepo({ where: { role: 'user' }, attributes: ['userId', 'username'] })
        res.json(users)
    }
    catch (error) {
        throw error
    }
}

const updateInfoUserFirebaseService = async (req, res) => {
    if (!req.body.userIdFirebase || !req.body.userId) {
        throw new CustomError("Thông tin không hợp lệ!", 400)
    }
    try {
        const { userIdFirebase, userId } = req.body
        const user = await updateUserRepo(userId, { userIdFirebase: userIdFirebase })
        res.json(user)
    }
    catch (error) {
        throw error
    }
}

const updateUserService = async (req, res) => {
    const { userId } = req.user
    try {
        const oldUser = await getUserByUserIdRepo(userId)
        if (oldUser) {
            const newUserTemp = {
                username: req?.body?.username ? req?.body?.username : oldUser.username,
                email: req?.body?.email ? req?.body?.email : oldUser.email,
                userId: oldUser.userId,
                firstname: req?.body?.firstname ? req?.body?.firstname : oldUser.firstname,
                lastname: req?.body?.lastname ? req?.body?.lastname : oldUser.lastname,
                phone: req?.body?.phone ? req?.body?.phone : oldUser.phone,
                address: req?.body?.address ? req?.body?.address : oldUser.address,
                avatar: req?.body?.avatar ? req?.body?.avatar : oldUser.avatar,
            }
            await updateUserRepo(userId, newUserTemp)
            const newUserAfterUpdate = await getUserByUserIdRepo(userId)
            res.json({
                userId: newUserAfterUpdate?.userId,
                username: newUserAfterUpdate?.username,
                email: newUserAfterUpdate?.email,
                userId: newUserAfterUpdate?.userId,
                phone: newUserAfterUpdate?.phone,
                firstname: newUserAfterUpdate?.firstname,
                lastname: newUserAfterUpdate?.lastname,
                avatar: newUserAfterUpdate?.avatar,
                address: newUserAfterUpdate.address
            })
        }
    }
    catch (error) {
        throw error
    }
}

const updatePasswordService = async (req, res) => {
    const { userId } = req.user;
    const { password, newPassword } = req.body;
    if (!req.body.password || !req.body.newPassword) {
        throw new CustomError("Vui lòng điền mật khẩu!", 400)
    }
    const user = await getUserByUserIdRepo(userId)
    if ((await checkMatchPasswordRepo(user, password)) && newPassword) {
        user.password = newPassword;
        await user.save()
        res.sendStatus(200)
    }
    else {
        throw new CustomError("Mật khẩu không chính xác, vui lòng thử lại!", 400)
    }
}

const forgetPasswordTokenService = async (req, res) => {
    if (!req.body.email) {
        throw new CustomError("Vui lòng điền email!", 400)
    }
    const { email } = req.body
    const user = await getUserByEmailRepo(email)
    try {
        if (!user) {
            throw new CustomError("Không tìm thấy người dùng!", 404)
        }
        const token = await createPasswordResetTokenRepo(user)
        await saveUserRepo(user)
        const resetUrl = `To reset you password, Click this link in 10 minutes. <a href="http://${user.role == 'user' ? 'localhost:3007' : 'localhost:3000'}/auth/reset-password?token=${token}">Click here</a>`
        const data = {
            to: email,
            subject: "Forgot password link",
            htm: resetUrl,
            text: "Reset password"
        }
        sendEmail(data)
        res.sendStatus(200)
    }
    catch (error) {
        throw error
    }
}

const resetPasswordService = async (req, res) => {
    if (!req.body.password || !req.params.token) {
        throw new CustomError("Link này dã hết hiệu lực, vui lòng thực hiện lại!", 400)
    }
    try {
        const { password } = req.body
        const { token } = req.params
        const hashedToken = crypto.createHash("sha256").update(token).digest("hex")
        const user = await getUserByConditionRepo({ where: { passwordResetToken: hashedToken, passwordResetExpires: { [Op.gt]: Date.now() } } })
        if (!user || user == null) {
            throw new CustomError("Link đã hết hiệu lực!", 404)
        }
        user.password = password
        user.passwordResetToken = ''
        user.passwordResetExpires = ''
        await saveUserRepo(user)
        res.sendStatus(200)
    }
    catch (error) {
        throw error
    }
}

const deleteUserService = async (req, res) => {
    if (!req.param.userId) {
        throw new CustomError("Không tìm thấy định danh người dùng!", 404)
    }
    try {
        const { userId } = req.params
        await deleteUserByConditionRepo({ userId: userId })
        res.sendStatus(200)
    }
    catch (error) {
        throw error
    }
}

const logoutService = async (req, res) => {
    const cookie = req.cookies;
    if (!cookie?.refreshToken) {
        throw new CustomError("Không tồn tại token", 400)
    }
    const refreshToken = cookie.refreshToken;
    const user = await getUserByConditionRepo({ where: { refreshToken: refreshToken } })
    if (!user) {
        res.clearCookie("refreshToken", {
            httpOnly: true,
            secure: true
        });
        return res.sendStatus(204)
    }
    await updateUserRepo(user.userId, { refreshToken: "" })
    res.clearCookie("refreshToken", {
        httpOnly: true,
        secure: true
    });
    return res.sendStatus(204)
}

module.exports = {
    userRegisterService,
    userLoginService,
    getUserByUserIdService,
    getUsersService,
    updateInfoUserFirebaseService,
    updateUserService,
    updatePasswordService,
    forgetPasswordTokenService,
    resetPasswordService,
    deleteUserService,
    logoutService
}