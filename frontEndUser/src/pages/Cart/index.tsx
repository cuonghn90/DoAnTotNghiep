import './style.css';
import * as Yup from 'yup';
import { Formik } from "formik";
import Button from 'components/Button';
import { Modal, notification, Select } from 'antd';
import { useEffect, useState } from 'react';
import { ShoppingOutlined, CloseOutlined, FilterOutlined } from '@ant-design/icons';
import { useAppDispatch, useAppSelector } from 'store/hook';
import CartItem from './components/CartItem/CartItem';
import { deleteCartByUser, getCartByUser, getPaymentConfig, resetCart, changeErrorToNull as changeErrorToNullCart, changeSuccessToFalse as changeSuccessToFalseCart } from './cartSlice';
import { changeErrorToNull, changeSuccessToFalse, createOrder } from 'pages/HistoryPage/orderSlice';
import { PayPalButton } from 'react-paypal-button-v2';
import { phoneRegExp } from "constant/constant";
import { sendNotification } from 'utils/common';
import Loading from 'components/Loading';
import userBg from 'assets/images/user.png';
import { ICoupon } from 'interface';
import { createCouponsUsed, getCoupons } from 'pages/Setting/components/MyCoupon/couponSlice';

const styleButtonPayPal = { "layout": "horizontal" };
type NotificationType = 'success' | 'info' | 'warning' | 'error';

const Cart = () => {
    //store
    const { userInfo } = useAppSelector(state => state.authStore);
    const { listCoupon } = useAppSelector(state => state.couponStore);
    const { error: errorCart, success: successCart, cart, loading: loadingCart, successMessage: successMessageCart } = useAppSelector(state => state.cartStore);
    const { successMessage: messageCreateOrder, success: successCreateOrder, error: errorCreateOrder, loading: loadingOrder } = useAppSelector(state => state.orderStore);
    const dispatch = useAppDispatch();

    //useState
    const [valueOptionPay, setValueOptionPay] = useState(1);
    const [valueAddress, setValueAddress] = useState(userInfo.address);
    const [valuePhone, setValuePhone] = useState(userInfo.phone);
    const [sdkReady, setSdkReady] = useState(false);
    const [modalOpen, setModalOpen] = useState(false);
    const [couponChoosed, setCouponChoosed] = useState({} as { discount: 0, couponCode: ''; });

    // state & function antd 
    const [valueCouponCode, setValueCouponCode] = useState('');
    const [optionsCouponCode, setOptionsCouponCode] = useState<any>([{ value: '', label: 'Chọn mã giảm giá', key: 'key-option-1' }]);
    const onChange = (value: any) => {
        if (value.title) {
            setCouponChoosed({ discount: value.title, couponCode: value.label });
        }
        else {
            setCouponChoosed({ discount: 0, couponCode: '' });
        }
        setValueCouponCode(value.label);
    };

    const onSearch = (value: string) => {
        console.log('search:', value);
    };

    // Filter `option.label` match the user type `input`
    const filterOption = (input: string, option?: { label: string; value: string; }) =>
        (option?.label ?? '').toLowerCase().includes(input.toLowerCase());

    const [api, contextHolder] = notification.useNotification();
    const openNotificationResetSuccess = (type: NotificationType, successMessage: string, title?: string) => {
        api[type]({
            message: title ? title : 'Thông báo',
            description: successMessage,
        });
    };

    // Function

    const deleteCouponFromCart = () => {
        setCouponChoosed({ discount: 0, couponCode: '' });
        setValueCouponCode('');
    };

    const handleSubmitForm = (values: any) => {
        setValueAddress(values.addressShip);
        setValuePhone(values.phoneShip);
        setModalOpen(true);
    };

    const handleDeleteCart = async () => {
        await dispatch(deleteCartByUser());
        dispatch(resetCart());
    };

    const handlePayment = async (optionPay: number, statusPayPal?: string, id?: string) => {
        const isPay = statusPayPal == "COMPLETED" ? "true" : "false";
        await dispatch(createOrder({
            paymentMethod: optionPay == 1 ? "Thanh toán khi nhận hàng" : "Paypal", address: valueAddress,
            phone: valuePhone, isPay, orderIdPaypal: id, paymentAmountAfterDiscount: cart.cartTotal * (couponChoosed.discount > 0 ? ((100 - couponChoosed.discount) / 100) : 1), couponCode: couponChoosed.couponCode
        }));
        if (couponChoosed.couponCode != '' && couponChoosed.discount > 0) {
            // await dispatch(createCouponsUsed({ couponCode: couponChoosed.couponCode }));
            await dispatch(getCoupons({ search: '', status: '', startDate: '', endDate: '' }));
        }
        setModalOpen(false);
        await dispatch(getCartByUser());
        await sendNotification(`Khách hàng ${userInfo.username} vừa có đơn hàng mới`, userInfo.userId, (userInfo?.avatar ? userInfo?.avatar : userBg), 'admin');
    };

    const addPaypalScript = async () => {
        const { data } = await getPaymentConfig();
        const script = document.createElement('script');
        script.type = 'text/javascript';
        script.src = `https://www.paypal.com/sdk/js?client-id=${data}`;
        script.async = true;
        script.onload = () => {
            setSdkReady(true);
        };
        document.body.appendChild(script);
    };

    // useEffect
    useEffect(() => {
        if (!window.paypal) {
            addPaypalScript();
        } else {
            setSdkReady(true);
        }
    }, []);

    useEffect(() => {
        if (userInfo.userId) {
            dispatch(getCartByUser());
        }
    }, [userInfo]);

    useEffect(() => {
        if (listCoupon && listCoupon.length > 0) {
            const optionsCoupon: any[] = [{ value: '', label: 'Chọn mã giảm giá', key: 'key-option-1' }];
            listCoupon.map(couponItem => {
                if (!couponItem.isUsed) {
                    optionsCoupon.push({
                        key: couponItem.couponId,
                        value: couponItem.couponId,
                        label: couponItem.couponCode,
                        title: couponItem.discount
                    });
                }
            });

            setOptionsCouponCode(optionsCoupon);
        }
    }, [listCoupon]);


    useEffect(() => {
        if (successCreateOrder) {
            if (messageCreateOrder) {
                openNotificationResetSuccess('success', messageCreateOrder);
            }
            dispatch(changeSuccessToFalse());
        }
        if (errorCreateOrder != null) {
            openNotificationResetSuccess('error', errorCreateOrder.message, 'Lỗi');
            dispatch(changeErrorToNull());
        }
    }, [errorCreateOrder, successCreateOrder]);

    useEffect(() => {
        if (successCart) {
            if (successMessageCart) {
                openNotificationResetSuccess('success', successMessageCart);
            }
            dispatch(getCartByUser());
            dispatch(changeSuccessToFalseCart());
        }
        if (errorCart != null) {
            openNotificationResetSuccess('error', errorCart.message, 'Lỗi');
            dispatch(changeErrorToNullCart());
        }
    }, [errorCart, successCart]);

    return (
        <>
            {
                userInfo.userId ?
                    <Formik
                        enableReinitialize
                        initialValues={{
                            addressShip: userInfo.address ? userInfo.address : '',
                            phoneShip: userInfo.phone ? userInfo.phone : ''
                        }}
                        validationSchema={Yup.object({
                            addressShip: Yup.string().required('Vui lòng nhập thông tin'),
                            phoneShip: Yup.string().matches(phoneRegExp, 'Số điện thoại không hợp lệ').required('Vui lòng nhập số điện thoại'),
                        })}
                        onSubmit={values => {
                            // same shape as initial values
                            handleSubmitForm(values);
                        }}>
                        {formik => (
                            <form style={{ width: '100%', height: '100%' }} onSubmit={formik.handleSubmit}>
                                {contextHolder}
                                <div className="cart">
                                    <div className="confirmation">
                                        <span className='header-text'>Giỏ hàng</span>
                                        <span className='cart-number'>{cart.id ? ('Có ' + cart.productsCart.length + ' món trong giỏ hàng') : 'Không có sản phẩm'}</span>
                                        {
                                            (cart.cartId && cart.productsCart.length > 0) ?
                                                <>
                                                    <div className='list-cart'>
                                                        {cart.productsCart.map(productCart => {
                                                            return (
                                                                <div key={'foodcart ' + productCart.productId} className='wrap-cart-item'>
                                                                    <CartItem productCart={productCart}></CartItem>
                                                                </div>
                                                            );
                                                        })}
                                                    </div>
                                                    <div className='footer-confirm-cart'>
                                                        <div className="group-btn">
                                                            {(cart.cartId && cart.productsCart.length > 0) ?
                                                                <Button handleClick={() => handleDeleteCart()}>Xóa tất cả</Button> : ''}
                                                        </div>
                                                    </div>
                                                </>
                                                :
                                                <div className='no-cart'>
                                                    <ShoppingOutlined className="no-product-in-cart" />
                                                    <span className='text-no-cart'>Không có sản phẩm</span>
                                                </div>
                                        }

                                    </div>
                                    <div className="payment">
                                        <span className='header-text'>Thanh toán</span>
                                        <span className='cart-number'> {(cart.cartId && cart.productsCart.length > 0) ? '2 phương thức thanh toán có sẵn' : 'Bạn chưa mua sản phẩm nào'}</span>
                                        <div className={"main-payment "}>
                                            {
                                                (cart.cartId && cart.productsCart.length > 0) ?
                                                    <>
                                                        <div className={'form-payment ' + (valueOptionPay == 1 ? 'option1' : 'option2')}>

                                                            <div className='text-payment-method' style={{ color: '#fff', fontSize: '15px' }}>
                                                                Tổng tiền giỏ hàng: {cart.cartTotal}
                                                            </div>
                                                            <Select
                                                                showSearch
                                                                labelInValue
                                                                placeholder="Chọn mã giảm giá"
                                                                optionFilterProp="children"
                                                                value={valueCouponCode}
                                                                style={{ color: '#fff', width: '200px', marginBottom: '5px' }}
                                                                onChange={onChange}
                                                                onSearch={onSearch}
                                                                filterOption={filterOption}
                                                                options={optionsCouponCode}
                                                                suffixIcon={<FilterOutlined />}
                                                            />
                                                            {
                                                                couponChoosed.couponCode ?
                                                                    <div className="coupon-choosed">
                                                                        <div className="coupon-choosed-code">{couponChoosed.couponCode}</div>
                                                                        <div className="coupon-choosed-discount">-{couponChoosed.discount}%</div>
                                                                        <div className="icon-delete-coupon">
                                                                            <CloseOutlined style={{ cursor: 'pointer' }} onClick={deleteCouponFromCart} />
                                                                        </div>
                                                                    </div>
                                                                    :
                                                                    <></>
                                                            }

                                                            <div className='text-payment-method' style={{ color: '#fff', fontSize: '15px' }}>
                                                                Tổng tiền đơn hàng: {cart.cartTotal * (couponChoosed.discount > 0 ? ((100 - couponChoosed.discount) / 100) : 1)}
                                                            </div>

                                                            <div className='from-input'>
                                                                <div className='payment-input'>
                                                                    <label className='label-input'>Địa chỉ nhận hàng</label>
                                                                    <input placeholder='Địa chỉ của bạn' type='input' {...formik.getFieldProps('addressShip')} name='addressShip' />
                                                                    {formik.touched.addressShip && formik.errors.addressShip ? (
                                                                        <div className="text-error">{formik.errors.addressShip}</div>
                                                                    ) : null}
                                                                </div>
                                                                <div className='payment-input'>
                                                                    <label className='label-input'>Số điện thoại</label>
                                                                    <input placeholder='Số điện thoại' type='input' {...formik.getFieldProps('phoneShip')} name='phoneShip' />
                                                                    {formik.touched.phoneShip && formik.errors.phoneShip ? (
                                                                        <div className="text-error">{formik.errors.phoneShip}</div>
                                                                    ) : null}
                                                                </div>
                                                            </div>

                                                        </div>
                                                        <div className='btns-payment'>

                                                            <div className='btn-payment'>
                                                            </div>
                                                            <div className='btn-payment'>
                                                                {
                                                                    valueOptionPay == 1 ?

                                                                        <input type="submit" className='button-primary' value='Thanh toán' id='btn' />
                                                                        :
                                                                        <>

                                                                        </>
                                                                }
                                                            </div>
                                                        </div>
                                                    </>
                                                    :
                                                    <div className='no-cart'>
                                                        <ShoppingOutlined className="no-product-in-cart" />
                                                        <span className='text-no-cart'>Không có sản phẩm</span>
                                                    </div>
                                            }
                                        </div>
                                    </div>
                                </div>
                                <Modal
                                    title="Payment Method"
                                    centered
                                    open={modalOpen}
                                    okButtonProps={{ style: { display: 'none' } }}
                                    onCancel={() => setModalOpen(false)}
                                    width={"400px"}
                                    cancelText={'Hủy'}
                                >
                                    <div className='text-payment-method'>

                                    </div>
                                    <div className='payment-method-list'>
                                        <div className="payment-method-item">
                                            <label className="label-method-item">Phương thức 1: </label>
                                            <Button btnClassName="" handleClick={() => handlePayment(1)}>Thanh toán khi nhận hàng</Button>
                                        </div>
                                        {
                                            sdkReady ?
                                                <div className="payment-method-item">
                                                    <label className="label-method-item">Phương thức 2:</label>
                                                    <div style={{ width: '300px', maxHeight: '45px', overflow: 'hidden' }}>
                                                        <PayPalButton
                                                            style={styleButtonPayPal}
                                                            createOrder={(data: any, actions: any) => actions.order.create({
                                                                purchase_units: [
                                                                    {
                                                                        amount: {
                                                                            currency_code: "USD",
                                                                            value: parseFloat((cart.cartTotal * (couponChoosed.discount > 0 ? ((100 - couponChoosed.discount) / 100) : 1)).toString()),
                                                                            breakdown: {
                                                                                item_total: {
                                                                                    currency_code: "USD",
                                                                                    value: parseFloat((cart.cartTotal * (couponChoosed.discount > 0 ? ((100 - couponChoosed.discount) / 100) : 1)).toString())
                                                                                }
                                                                            }
                                                                        },
                                                                        items: cart.productsCart.map(productCart => {
                                                                            return {
                                                                                name: productCart.product.name,
                                                                                unit_amount: { currency_code: 'USD', value: parseFloat((productCart.product.price * (couponChoosed.discount > 0 ? ((100 - couponChoosed.discount) / 100) : 1)).toString()) },
                                                                                quantity: productCart.count
                                                                            };
                                                                        })
                                                                    }
                                                                ]
                                                            }).then((orderId: any) => orderId)}
                                                            onApprove={(data: any, actions: any) => actions.order.capture().then(async (response: any) => {
                                                                handlePayment(2, response.status, response.id);
                                                            })}
                                                        />
                                                    </div>
                                                </div>
                                                :
                                                ''
                                        }
                                    </div>
                                    {loadingOrder ? <Loading></Loading> : <></>}
                                </Modal>
                                {loadingCart ? <Loading></Loading> : <></>}
                            </form>
                        )}
                    </Formik>
                    :
                    <div className='login-to-view-cart'>Bạn chưa đăng nhập</div>
            }
        </>
    );
};
export default Cart;
