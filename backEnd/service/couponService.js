const { v4: uuidv4 } = require('uuid');
const { CustomError } = require("../utils/CustomError");
const { getCouponsRepo, createCouponRepo, updateCouponRepo, deleteCouponRepo, createCouponUsedRepo, checkCouponUsedExistRepo, filterCouponsRepo, getCouponsUsedRepo, getCouponRepo } = require('../repository/couponRepository');
const { Op } = require('sequelize');
const { autoGenerateCouponCode, formatDate } = require('../utils/commonFunction');

const getCouponsService = async (req, res) => {
    try {
        const sort = (req.query.sort || 'desc')
        const status = (req.query.status || '')
        const search = (req.query.search || '')
        let startDate = new Date("2023-01-01");
        if (req.query.startDate !== 'undefined' && req.query.startDate !== '') {
            startDate = req.query.startDate
        }
        let endDate = new Date("2024-01-01")
        if (req.query.endDate !== 'undefined' && req.query.endDate !== '') {
            endDate = req.query.endDate
        }
        const coupons = await getCouponsRepo({ where: { couponCode: { [Op.substring]: [search] }, statusCoupon: { [status === '' ? Op.substring : Op.eq]: [status] }, startDateDiscount: { [Op.gte]: startDate }, endDateDiscount: { [Op.lte]: endDate } }, order: [['createdAt', sort]], subQuery: false })
        res.json(coupons)
    }
    catch (error) {
        throw error
    }
}
const getCouponsAndCheckUsedService = async (req, res) => {
    try {
        const sort = (req.query.sort || 'desc')
        const status = (req.query.status || '')
        const search = (req.query.search || '')
        let startDate = new Date("2023-01-01");
        if (req.query.startDate !== 'undefined' && req.query.startDate !== '') {
            startDate = req.query.startDate
        }
        let endDate = new Date("2024-01-01")
        if (req.query.endDate !== 'undefined' && req.query.endDate !== '') {
            endDate = req.query.endDate
        }
        const coupons = await getCouponsRepo({ where: { takeBy: { [Op.eq]: ['system'] }, couponCode: { [Op.substring]: [search] }, statusCoupon: { [status === '' ? Op.substring : Op.eq]: [status] }, startDateDiscount: { [Op.gte]: startDate }, endDateDiscount: { [Op.lte]: endDate } }, order: [['createdAt', sort]], subQuery: false })
        const couponsOnlyUser = await getCouponsRepo({ where: { takeBy: { [Op.substring]: [req.user.username] }, couponCode: { [Op.substring]: [search] }, statusCoupon: { [status === '' ? Op.substring : Op.eq]: [status] }, startDateDiscount: { [Op.gte]: startDate }, endDateDiscount: { [Op.lte]: endDate } }, order: [['createdAt', sort]], subQuery: false })
        const responseCoupons = []
        for (const coupon of coupons.concat(couponsOnlyUser)) {
            const couponUsed = await checkCouponUsedExistRepo({ where: { couponId: coupon.couponId, userId: req.user.userId } })
            responseCoupons.push({
                ...coupon.dataValues,
                isUsed: couponUsed
            })
        }
        res.json(responseCoupons)
    }
    catch (error) {
        throw error
    }
}

const filterCouponsService = async (req, res) => {
    try {
        const page = parseInt((req.query.page || 1))
        const limit = parseInt((req.query.limit || 10));
        const sort = (req.query.sort || 'desc')
        const status = (req.query.status || '')
        const search = (req.query.search || '')
        let startDate = new Date("2023-01-01")
        if (req.query.startDate !== 'undefined' && req.query.startDate !== '') {
            startDate = req.query.startDate
        }
        let endDate = new Date("2024-01-01")
        if (req.query.endDate !== 'undefined' && req.query.endDate !== '') {
            endDate = req.query.endDate
        }
        const coupons = await filterCouponsRepo({ where: { couponCode: { [Op.substring]: [search] }, statusCoupon: { [status === '' ? Op.substring : Op.eq]: [status] }, startDateDiscount: { [Op.gte]: startDate }, endDateDiscount: { [Op.lte]: endDate } }, offset: ((page - 1) * limit), limit: limit, order: [['createdAt', sort]], subQuery: false })
        res.json(coupons)
    }
    catch (error) {
        throw error
    }
}

const getCouponService = async (req, res) => {
    const { couponId } = req.params
    if (!couponId) {
        throw new CustomError("Định danh phiếu giảm giá không hợp lệ.", 400)
    }
    try {
        const coupon = await getCouponRepo({ where: { couponId: couponId } })
        if (coupon == null) {
            throw new CustomError("Không tìm thấy phiếu giảm giá.", 400)
        }
        res.json(coupon)
    }
    catch (error) {
        throw error
    }
}

const createCouponService = async (req, res) => {
    const { couponCode, discount, startDateDiscount, endDateDiscount, discountFor, takeBy } = req.body
    if (!couponCode || !discount || !startDateDiscount || !endDateDiscount || !discountFor || !takeBy) {
        throw new CustomError("Thiếu dữ liệu để tạo phiếu giảm giá", 400)
    }
    try {
        const coupon = await getCouponRepo({ where: { couponCode: couponCode } })
        if (coupon !== null) {
            throw new CustomError("Mã phiếu giảm giá đã tồn tại, Vui lòng thử mã khác", 400)
        }
        const newCoupon = {
            couponCode: couponCode,
            discount: discount,
            startDateDiscount: startDateDiscount,
            endDateDiscount: endDateDiscount,
            discountFor: discountFor,
            takeBy: takeBy
        }
        await createCouponRepo(newCoupon)
        res.sendStatus(200)
    }
    catch (error) {
        throw error
    }
}

const giveCouponService = async (req, res) => {
    const {  discount, takeBy } = req.body
    if ( !discount ||!takeBy) {
        throw new CustomError("Thiếu dữ liệu để tạo phiếu giảm giá", 400)
    }
    try {
        let isExistCoupon = true
        const typeCoupon = 'USER'
        let newCouponCode
        while (isExistCoupon) {
            newCouponCode = autoGenerateCouponCode(typeCoupon)
            const coupon = await getCouponRepo({ where: { couponCode: newCouponCode } })
            if (!coupon || coupon == null) {
                isExistCoupon = false
                break;
            }
        }
        const today = new Date()
        const newCoupon = {
            couponCode: newCouponCode,
            discount: discount,
            startDateDiscount: formatDate(today),
            endDateDiscount: formatDate(new Date(today.getTime() + 7 * 24 * 60 * 60 * 1000)),
            takeBy: takeBy
        }
        await createCouponRepo(newCoupon)
        res.sendStatus(200)
    }
    catch (error) {
        throw error
    }
}

const createCouponCodeService = async (req, res) => {
    try {
        let isExistCoupon = true
        const { typeCoupon } = req.body
        let newCouponCode
        while (isExistCoupon) {
            newCouponCode = autoGenerateCouponCode(typeCoupon)
            const coupon = await getCouponRepo({ where: { couponCode: newCouponCode } })
            if (!coupon || coupon == null) {
                isExistCoupon = false
                break;
            }
        }
        res.json({
            couponCode: newCouponCode
        })
    }
    catch (error) {

    }
}

const updateCouponService = async (req, res) => {
    const { couponId } = req.params
    const { discount, startDateDiscount, endDateDiscount, statusCoupon } = req.body
    if (!couponId || !discount || !startDateDiscount || !endDateDiscount) {
        throw new CustomError("Thiếu dữ liệu để sửa phiếu giảm giá", 400)
    }
    try {
        const coupon = await getCouponRepo({ where: { couponId: couponId } })
        if (coupon == null) {
            throw new CustomError("Phiếu giảm giá không tồn tại, Vui lòng xem lại", 400)
        }
        const newCoupon = {
            discount: discount,
            startDateDiscount: startDateDiscount,
            endDateDiscount: endDateDiscount,
            statusCoupon: statusCoupon
        }
        await updateCouponRepo(newCoupon, { where: { couponId: couponId } })
        res.sendStatus(200)
    }
    catch (error) {
        throw error
    }
}

const deleteCouponService = async (req, res) => {
    const { couponId } = req.params
    if (!couponId) {
        throw new CustomError("Định danh phiếu giảm giá không hợp lệ.", 400)
    }
    try {
        const coupon = await getCouponRepo({ where: { couponId: couponId } })
        if (coupon == null) {
            throw new CustomError("Phiếu giảm giá không tồn tại, Vui lòng xem lại", 400)
        }
        await deleteCouponRepo({ where: { couponId: couponId } })
        res.sendStatus(200)
    }
    catch (error) {
        throw error
    }
}

const getCouponsUsedService = async (req, res) => {
    try {
        const couponsused = await getCouponsUsedRepo()
        res.json(couponsused)
    }
    catch (error) {
        throw error
    }
}

const createCouponUsedService = async (req, res) => {
    const { couponCode } = req.body
    const { userId } = req.user
    if (!couponCode) {
        throw new CustomError("Mã giảm giá không hợp lệ, hoặc bạn không thể dùng phiếu giảm giá này.", 400)
    }
    try {
        const coupon = await getCouponRepo({ where: { couponCode: couponCode } })
        if (coupon == null) {
            throw new CustomError("Không thể dùng phiếu giảm giá này.", 400)
        }
        const newCouponUsed = {
            couponId: coupon.couponId,
            userId: userId
        }
        await createCouponUsedRepo(newCouponUsed)
        res.sendStatus(200)
    }
    catch (error) {
        throw error
    }
}


const checkCouponUsedExistService = async (req, res) => {
    const { couponId, userId } = req.body
    if (!couponId || !userId) {
        throw new CustomError("Không thể dùng phiếu giảm giá này.", 400)
    }
    try {
        const isExist = await checkCouponUsedExistRepo({ where: { couponId: couponId, userId: userId } })
        res.sendStatus(200).json({
            isUsedCoupon: isExist
        })
    }
    catch (error) {
        throw error
    }
}

module.exports = { getCouponsService, getCouponsAndCheckUsedService, getCouponService, createCouponService, createCouponCodeService, giveCouponService, updateCouponService, deleteCouponService, filterCouponsService, getCouponsUsedService, createCouponUsedService, checkCouponUsedExistService }