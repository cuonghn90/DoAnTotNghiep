import { useAppSelector } from 'store/hook';
import './style.css';
import bg from 'assets/images/bg.jpg';
import { useEffect } from 'react';
import { changeCouponDiscountForToVietNameses, formatDateFullYear } from 'utils/common';

const MyCoupon = () => {
    const { userInfo } = useAppSelector(state => state.authStore);
    const { listCoupon } = useAppSelector(state => state.couponStore);

    return (
        <div className='setting-my-coupon'>
            {
                userInfo.userId ?
                    <div className="wrap-list-coupon">
                        <div className="grid-coupon">
                            {
                                (listCoupon && listCoupon.length > 0) ? listCoupon.slice().sort((a, b) => new Date(b.createdAt).valueOf() - new Date(a.createdAt).valueOf()).map(couponItem => {
                                    return (
                                        <div className="my-coupon-item">
                                            <div className="left-content-my-coupon-item">
                                                <div className="wrap-image-my-coupon">
                                                    <img src={bg} alt="image-coupon-item" className='image-my-coupon' />
                                                </div>
                                            </div>
                                            <div className="right-content-my-coupon-item">
                                                <div className="my-coupon-item-code">
                                                    {couponItem.couponCode}
                                                </div>
                                                <div className="my-coupon-item-discount">
                                                    {couponItem.discount}% OFF
                                                </div>
                                                <div className="my-coupon-item-discounFor">
                                                    {changeCouponDiscountForToVietNameses(couponItem.discountFor)}
                                                </div>
                                                <div className='my-coupon-item-endDate'>
                                                    Hiệu lực đến {formatDateFullYear(couponItem.endDateDiscount)}
                                                </div>
                                            </div>
                                            {
                                                couponItem.isUsed ? 
                                                    <div className="used-coupon-item">
                                                        <span className="text-used-coupon-item">
                                                            Đã sử dụng
                                                        </span>
                                                    </div>
                                                    :
                                                    <></>
                                            }
                                            
                                        </div>
                                    );
                                }) :
                                    <div className="no-coupon">
                                        Bạn không có phiếu giảm giá nào.
                                    </div>
                            }

                        </div>

                    </div>
                    :
                    <div className="you-not-login">Bạn chưa đăng nhập</div>
            }
        </div>
    );
};

export default MyCoupon;