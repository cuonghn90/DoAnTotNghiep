import './style.css';
import Button from "components/Button";
import { changePaymentStatusToVietNameses, changeStatusOrderToVietNameses, formatDate, formatDateFullYear, formatOnlyHour } from "utils/common";
import { useEffect, useState } from "react";
import Pagination from "components/Pagination";
import { Card, Modal, Popconfirm, Segmented, Steps, Timeline, message, notification } from "antd";
import { INumberItemPerPage, IOrder } from "interface";
import { useAppDispatch, useAppSelector } from "store/hook";
import { EyeOutlined, DeleteOutlined, SearchOutlined, CloseOutlined } from '@ant-design/icons';
import { cancleOrder, changeErrorToNull, changeSuccessToFalse, deleteOrder, deleteOrders, filterOrders, getOrderByUser, getOrdersByUser, setStateOpenFormAfterClickNoti } from "pages/HistoryPage/orderSlice";
import bg from 'assets/images/bg.jpg';
type NotificationType = 'success' | 'info' | 'warning' | 'error';

const HistoryPage = () => {

    // Store
    const dispatch = useAppDispatch();
    const { userInfo } = useAppSelector(state => state.authStore);
    const { orders, openFormAfterClickNoti, order: orderDetail, success, error, successMessage } = useAppSelector(state => state.orderStore);

    // useState
    const [numberItemPerPage, setNumberItemPerPage] = useState({
        id: '1',
        label: '10 bản ghi/trang',
        value: 10
    });
    const [valueSearch, setValueSearch] = useState('');
    const [modalTrackOrder, setModalTrackOrder] = useState(false);
    const [valueSegmentd, setValueSegmentd] = useState('NotDelivered');
    const [currentPage, setCurrentPage] = useState(1);
    const [timeLineOrder, setTimeLineOrder] = useState<any[]>([]);
    const [listOrderRender, setListOrderRender] = useState([] as Array<IOrder>);

    // constant Pagination
    const optionsItemPerPage = [
        {
            id: '1',
            value: '10',
            label: '10 bản ghi/trang',
        },
        {
            id: '2',
            value: '20',
            label: '20 bản ghi/trang',
        },
        {
            id: '3',
            value: '30',
            label: '30 bản ghi/trang',
        },
    ];

    // #region Model Info
    const info = (order: IOrder) => {
        if (order.orderId) {
            Modal.info({
                className: 'modal-detail-order',
                title: 'Chi tiết hóa đơn ' + order.id,
                centered: true,
                content: (
                    <div className="bill-history">
                        <div className="header-bill">
                            <div className="image-bill">
                                <img src={order.productsOrder[0].product.image} alt='bill'></img>
                            </div>
                            <div className="text-payment-id">Đơn hàng: {order.id}</div>
                            <div className="row-bill" style={{ color: (order.paymentStatus == 'Paid' ? 'green' : 'tomato') }}>{changePaymentStatusToVietNameses(order.paymentStatus)}</div>
                            <div className="row-bill" >Trạng thái đơn hàng: <b style={{ marginLeft: '5px' }}>{changeStatusOrderToVietNameses(order.orderStatus)}</b></div>
                            <div className="date-bill">
                                {/* <span className="text-date-bill">{currentPaymentView.createDate}</span> */}
                            </div>
                        </div>
                        <div className="list-food-ordered">
                            {order.productsOrder.map(productOrder => {
                                return (
                                    <div className="food-ordered-item" key={productOrder.productOrderId}>
                                        <div className="name-food-ordered">{productOrder.product.name}</div>
                                        <div className="quantity-food-ordered">{productOrder.count}</div>
                                        <div className="price-food-ordered">{productOrder.product.price}/1</div>
                                        <div className="total-money-food-ordered">{productOrder.count * productOrder.product.price}</div>
                                    </div>
                                );
                            })}
                        </div>
                        <div className="row-bill">
                            <div className="col-bill">Tổng tiền</div>
                            <div className="col-bill">{order.paymentAmount}</div>
                        </div>
                        <div className="row-bill">
                            <div className="col-bill">Mã giảm giá</div>
                            <div className="col-bill">{order.couponUsed ? order.couponUsed.couponCode : ''} {order.couponUsed ? order.couponUsed.discount : '0'}%</div>
                        </div>
                        <div className="row-bill">
                            <div className="col-bill">Tổng tiền sau giảm giá</div>
                            <div className="col-bill">{order.paymentAmountAfterDiscount}</div>
                        </div>
                        <div className="bill-payment-method">
                            <div className="text-method-payment">
                                Hình thức thanh toán:
                            </div>
                            <div className="list-method">
                                <div className="method-payment-bill-item">
                                    {order.paymentMethod}
                                </div>
                            </div>
                        </div>
                    </div>
                ),
                onOk () {
                    if (openFormAfterClickNoti) {
                        dispatch(setStateOpenFormAfterClickNoti(false));
                    }
                },
                okText: 'Đóng',

            });
        }
    };

    // #endregion

    // state & function antd
    const [api, contextHolder] = notification.useNotification();
    const openNotificationResetSuccess = (type: NotificationType, successMessage: string, title?: string) => {
        api[type]({
            message: title ? title : 'Thông báo',
            description: successMessage,
        });
    };

    const changeSegmented = (value: any) => {
        setValueSegmentd(value)
        
    }

    const [isModalDeleteAllOpen, setIsModalDeleteAllOpen] = useState(false);
    const confirmDeleteOrder = async (order: IOrder) => {
        await dispatch(deleteOrder(order));
    };

    const confirmCancleOrder = async (order: IOrder) => {
        await dispatch(cancleOrder(order));
    };

    const cancel = () => {
    };

    const openModelDeleteAll = () => {
        setIsModalDeleteAllOpen(true);
    };

    const handleDeleteAllOrder = async () => {
        await dispatch(deleteOrders());
        setIsModalDeleteAllOpen(false);
    };
    const handleNoDelteAllOrder = () => {
        setIsModalDeleteAllOpen(false);
    };

    // Function
    // Functionn Pagination
    const onPageChange = (newPage: number) => {
        setCurrentPage(newPage);
        handleFilterOrders({ search: valueSearch, limit: numberItemPerPage.value, page: newPage, status: '' });
    };

    const onChangeNumberItemPerPage = async (newItem: INumberItemPerPage) => {
        setNumberItemPerPage({
            ...newItem
        });
        onPageChange(1);
        await dispatch(getOrdersByUser({ search: valueSearch }));
        handleFilterOrders({ search: valueSearch, limit: newItem.value, page: 1, status: '' });
    };


    const handleFilterOrders = async ({ search, limit, page, status }: any) => {
        const dataOrders = await dispatch(filterOrders({ search: search, limit: limit, page: page, status: status }));
        setListOrderRender(dataOrders.payload.orders);
    };

    // Function Button
    const viewDetailOrder = async (orderItem: IOrder) => {
        const orderState = await dispatch(getOrderByUser(orderItem));
        info(orderState.payload);
    };

    const viewTrackOrder = async (orderItem: IOrder) => {
        await dispatch(getOrderByUser(orderItem));
        setModalTrackOrder(true)
    };

    // useEffect
    useEffect(() => {
        if (userInfo.userId) {
            dispatch(getOrdersByUser({ search: '' }));
            handleFilterOrders({ search: '', limit: numberItemPerPage.value, page: 1, status: '' });
        }
    }, [userInfo.userId]);

    useEffect(() => {
        console.log(openFormAfterClickNoti);
        
        if (openFormAfterClickNoti && orderDetail.orderId) {
            setModalTrackOrder(true)
        }
    }, [openFormAfterClickNoti]);

    useEffect(() => {
        if (success) {
            if (successMessage) {
                openNotificationResetSuccess('success', successMessage);
            }
            dispatch(changeSuccessToFalse());
            dispatch(getOrdersByUser({ search: valueSearch }));
            handleFilterOrders({ search: valueSearch, limit: numberItemPerPage.value, page: currentPage, status: '' });
        }
        if (error != null) {
            openNotificationResetSuccess('error', error.message, 'Lỗi');
            dispatch(changeErrorToNull());
        }
    }, [error, success]);

    const renderNewTimeLine = (orderStatus: string) => {
        const newTimeLine: any[] = []
        const arrayOrderStatus = ['Unconfimred', 'Cancelled', 'Confirmed', 'Processing', 'Dispatched', 'Delivered']
        const arrayColor = ['tomato', 'red', 'green', 'green', 'green', 'green']
        for(let i = 0 ; i<arrayOrderStatus.length ; i++){
            if(arrayOrderStatus[i] === orderStatus){
                newTimeLine.push({
                    children: changeStatusOrderToVietNameses(arrayOrderStatus[i]),
                    color: arrayColor[i]
                })
                break;
            }
            if (arrayOrderStatus[i] === 'Cancelled' && orderStatus != 'Cancelled') {
                continue;
            }
            newTimeLine.push({
                children: changeStatusOrderToVietNameses(arrayOrderStatus[i]),
                color: arrayColor[i]
            })
            
        }
        
        return newTimeLine
    }

    useEffect(()=>{
        if(orderDetail.orderId){
            const newTimeLine = renderNewTimeLine(orderDetail.orderStatus)
            setTimeLineOrder(newTimeLine)
        }
    }, [orderDetail.orderId])

    return (
        <>
            {
                userInfo.userId ?
                    <div className="history">
                        {contextHolder}
                        <div className="m-page-toolbar">
                            <div className="m-page-toolbar-item-left">
                                <Segmented value={valueSegmentd} onChange={(value) => changeSegmented(value)} options={[{
                                    value: 'NotDelivered',
                                    label: 'Đang xử lí'
                                },
                                {
                                    value: 'Delivered',
                                    label: 'Đã nhận'
                                }]} />
                            </div>
                            <div className="m-input-search m-page-toolbar-item">
                            </div>
                        </div>
                        <div className="m-page-grid">
                            <div className="m-grid">
                                {listOrderRender.filter(orderItem => {
                                    if (valueSegmentd == 'Delivered'){
                                        if (orderItem.orderStatus == 'Delivered'){
                                            return orderItem
                                        }
                                    }
                                    else{
                                        if (orderItem.orderStatus != 'Delivered') {
                                            return orderItem;
                                        }
                                    }
                                } ).map(orderItem => {
                                    return (
                                        <Card key={orderItem.id} className='item-card-order'>
                                            <div className="card-order">
                                                <div className="left-card">
                                                    <div className="wrap-image-card">
                                                        <img src={bg} alt="" />
                                                    </div>
                                                    <div className="wrap-info-card">
                                                        <div className="text-info-card" style={{fontSize: '17px', fontWeight:500}}>Mã đơn hàng: #{orderItem.id}</div>
                                                        <div className="text-info-card">Tổng tiền: {orderItem.paymentAmountAfterDiscount}</div>
                                                        <div className="text-info-card">{formatDateFullYear(orderItem.createdAt)}  &nbsp;  |  &nbsp;&nbsp;{formatOnlyHour(orderItem.createdAt)}</div>
                                                    </div>
                                                </div>
                                                <div className="right-cart">
                                                    <div className="row-action-card">
                                                        <div
                                                            className="btns-action"
                                                        >
                                                            <EyeOutlined className="icon" onClick={() => viewDetailOrder(orderItem)} />
                                                            <Popconfirm
                                                                title="Xóa hóa đơn"
                                                                description="Bạn có chắc muốn xóa hóa đơn này không?"
                                                                onCancel={cancel}
                                                                onConfirm={() => confirmDeleteOrder(orderItem)}
                                                                okText="Có"
                                                                cancelText="Không"
                                                            >
                                                                <DeleteOutlined className="icon icon-delete" />
                                                            </Popconfirm>
                                                            {
                                                                orderItem.orderStatus == 'Cancelled' ?
                                                                    <CloseOutlined className="icon icon-cancle disable" />
                                                                    :
                                                                    <Popconfirm
                                                                        title="Xóa hóa đơn"
                                                                        description={(orderItem.isPay == 'true' ? 'Đơn hàng đã được trả tiền, sẽ chỉ được hoàn 50% nếu hủy. ' : '') + "Bạn có chắc muốn hủy hóa đơn này không?"}
                                                                        onConfirm={() => confirmCancleOrder(orderItem)}
                                                                        onCancel={cancel}
                                                                        okText="Có"
                                                                        cancelText="Không"
                                                                    >
                                                                        <CloseOutlined className="icon icon-cancle " />
                                                                    </Popconfirm>
                                                            }
                                                        </div>
                                                        <button className='trash-order-btn' onClick={() => { viewTrackOrder(orderItem)}}>Trạng thái đơn hàng</button>
                                                    </div >
                                                </div>
                                            </div>
                                        </Card>
                                    );
                                })}
                            </div>
                            <Pagination
                                handleChangeNumberItemPerPage={onChangeNumberItemPerPage}
                                currentPage={currentPage}
                                handleChangePage={onPageChange}
                                listDataTable={(orders ? orders : [])}
                                numberItemPerPage={numberItemPerPage}
                                siblingCount={1}
                                optionsItemPerPage={optionsItemPerPage}
                            ></Pagination>
                        </div>
                        <Modal className='modal-add-food' centered title={'Xóa tất cả'} cancelText={'Không'} okText={'Có'} open={isModalDeleteAllOpen} onOk={handleDeleteAllOrder} onCancel={handleNoDelteAllOrder}>
                            <p className='text-noti-food-is-exist'>Bạn chắc chắn muốn xóa hết hóa đơn không ?</p>
                        </Modal>
                        <Modal className='modal-track-order' title={'Trạng thái đơn hàng: #' + orderDetail.id} centered open={modalTrackOrder} onCancel={() => { setModalTrackOrder(false); dispatch(setStateOpenFormAfterClickNoti(false))}} footer={[
                            <Button handleClick={() => { setModalTrackOrder(false); dispatch(setStateOpenFormAfterClickNoti(false)); }}>Đóng</Button>
                        ]}>
                            <Timeline
                                reverse={true}
                                pending={orderDetail.orderStatus == 'Delivered' ? false :  'Đang xử lí'}
                                items={timeLineOrder}
                            />
                        </Modal>
                    </div >
                    : <div className="login-to-view-history">Bạn chưa đăng nhập</div>
            }
        </>

    );
};
export default HistoryPage;