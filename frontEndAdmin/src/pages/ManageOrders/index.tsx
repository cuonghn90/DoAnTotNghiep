import './style.css';
import { CSVLink } from 'react-csv';
import { FilterOutlined, EyeOutlined, DownOutlined, DeleteOutlined, SearchOutlined } from '@ant-design/icons';
import { Button, Modal, Popconfirm, Select, notification } from 'antd';
import { useEffect, useRef, useState } from 'react';
import { INumberItemPerPage, IOrder } from 'interface';
import { useAppDispatch, useAppSelector } from 'store/hook';
import Pagination from 'components/Pagination/Pagination';
import ReactToPrint from 'react-to-print';
import { changeErrorToNull, changeStatusSuccessToFalse, deleteOrder, filterOrders, getOrderByUser, getOrders, updateStatusOrderByUser, updateStatusPaymentByUser } from 'pages/Home/orderSlice';
import { changePaymentStatusToVietNameses, changeStatusOrderToVietNameses, formatDate, getDayMonthYear, getHourMinuteSecond, sendNotification } from 'utils/uitls';
import Loading from 'components/Loading/Loading';
import userBg from 'assets/images/user.png';

type NotificationType = 'success' | 'info' | 'warning' | 'error';

const ManageOrders = () => {
    // store
    const dispatch = useAppDispatch();
    const { orders, order, success, error, loading, successMessage } = useAppSelector(state => state.orderStore);
    const { userInfo } = useAppSelector(state => state.authStore);

    // useRef
    const componentPrint = useRef<HTMLDivElement>(null);

    // useState    
    const [numberItemPerPage, setNumberItemPerPage] = useState({
        id: '1',
        label: '10 bản ghi/trang',
        value: 10
    });
    const [statusOrder, setStatusOrder] = useState<any | null>(null);
    const [statusPayment, setStatusPayment] = useState<any | null>(null);
    const [valueSearch, setValueSearch] = useState('');
    const [valueStatus, setValueStatus] = useState('');
    const [currentPage, setCurrentPage] = useState(1);
    const [userIdFirebaseOrder, setUserIdFirebaseOrder] = useState('');
    const [listOrderRender, setListOrderRender] = useState([] as Array<IOrder>);

    // constant options item per page Pagination
    const optionsItemPerPage = [
        {
            id: '1',
            label: '10 bản ghi/trang',
            value: 10
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

    // state & function  antd
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isModalPaidOpen, setIsModalPaidOpen] = useState(false);
    const [api, contextHolderNoti] = notification.useNotification();
    const showModal = () => {
        setIsModalOpen(true);
    };
    const handleOk = () => {
        setIsModalOpen(false);
    };
    const handleCancel = () => {
        setIsModalOpen(false);
    };

    const showModalPaid = () => {
        setIsModalPaidOpen(true);
    };
    const handleOkPaid = () => {
        setIsModalPaidOpen(false);
    };
    const handleCancelPaid = () => {
        setIsModalPaidOpen(false);
    };

    const info = (order: IOrder) => {
        Modal.info({
            className: 'modal-info ',
            title: 'Chi tiết hóa đơn #' + order.id,
            width: '300px !important',
            content: (
                <div className="order-history" >
                    <div className="header-order">
                        <div className="image-order">
                            <img src={order.productsOrder[0].product.image} alt='order'></img>
                        </div>
                        <div className="text-payment-id">Hóa đơn: {order.id}</div>
                        <div className="date-order">
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
                    <div className="row-order">
                        <div className="col-order">Tổng</div>
                        <div className="col-order">{order.paymentAmount}</div>
                    </div>
                    <div className="row-order">
                        <div className="col-order">Mã giảm giá</div>
                        <div className="col-order">{order.couponCode}</div>
                    </div>
                    <div className="row-order">
                        <div className="col-order">Tổng sau giảm giá</div>
                        <div className="col-order">{order.paymentAmountAfterDiscount}</div>
                    </div>
                    <div className="order-payment-method">
                        <div className="text-method-payment">
                            Hình thức thanh toán
                        </div>
                        <div className="list-method">
                            <div className="method-payment-order-item">
                                {order.paymentMethod}
                            </div>
                        </div>
                    </div>
                </div>
            ),
            onOk () { },
            okText: 'Đóng',
            footer: (_, { OkBtn, CancelBtn }) => (
                <>
                    <ReactToPrint trigger={() => {
                        return <button className='button-primary btn-print'>In hoá đơn</button>;
                    }}
                        documentTitle='Hóa đơn'
                        content={() => componentPrint.current}
                    >
                    </ReactToPrint>
                    <CancelBtn />
                    <OkBtn />
                </>
            ),
        });
    };
    const openNotificationResetSuccess = (type: NotificationType, successMessage: string) => {
        api[type]({
            message: 'Thông báo',
            description: successMessage,
        });
    };

    // Function
    const viewDetailOrder = async (orderItem: IOrder) => {
        const orderState = await dispatch(getOrderByUser(orderItem));
        info(orderState.payload);
    };
    const onPageChange = (newPage: number) => {
        setCurrentPage(newPage);
        handleFilterOrders({ search: valueSearch, limit: numberItemPerPage.value, page: newPage, status: valueStatus });
    };

    const onChangeNumberItemPerPage = async (newItem: INumberItemPerPage) => {
        setNumberItemPerPage({
            ...newItem
        });
        setCurrentPage(1);
        await dispatch(getOrders({ search: valueSearch, status: valueStatus }));
        await handleFilterOrders({ search: valueSearch, limit: newItem.value, page: 1, status: valueStatus });
    };

    const handleChange = async (value: string) => {
        setValueStatus(value);
        await dispatch(getOrders({ search: valueSearch, status: value }));
        handleFilterOrders({ search: valueSearch, limit: numberItemPerPage.value, page: 1, status: value });
    };

    const handleSeachOrder = async (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key == 'Enter') {
            await dispatch(getOrders({ search: valueSearch, status: '' }));
            onPageChange(1);
        }
    };

    const handleFilterOrders = async ({ search, limit, page, status }: any) => {
        const dataOrders = await dispatch(filterOrders({ search: search, limit: limit, page: page, status: status }));
        setListOrderRender(dataOrders.payload.orders);
    };

    const handleChangeSelectValue = (value: string) => {
        setStatusOrder(value);
    };

    const openModalChageStatus = async (orderItem: IOrder) => {
        const orderState = await dispatch(getOrderByUser(orderItem));
        const stringStatus: string = orderState.payload.orderStatus;
        setStatusOrder(stringStatus);
        showModal();
    };

    const openModalChageStatusPayment = async (orderItem: IOrder) => {
        const orderState = await dispatch(getOrderByUser(orderItem));
        const stringStatus: string = orderState.payload.paymentStatus;
        setStatusPayment(stringStatus);
        showModalPaid();
    };

    const handleChangeStatus = async () => {
        if (statusOrder === order.orderStatus) {
            setIsModalOpen(false);
        }
        else {
            await dispatch(updateStatusOrderByUser({ orderId: order.orderId, newStatus: statusOrder }));
            setIsModalOpen(false);
            await sendNotification(`Trạng thái đơn hàng số ${order.id} : ${changeStatusOrderToVietNameses(statusOrder)}`, userInfo.userId, (userInfo.avatar ? userInfo.avatar : userBg), userIdFirebaseOrder, order.orderId);
        }
    };

    const handleSelectStatusPayment = (value: string) => {
        setStatusPayment(value);
    };

    const handleChangeStatusPayment = async () => {
        if (statusPayment === order.paymentStatus) {
            setIsModalPaidOpen(false);
        }
        else {
            await dispatch(updateStatusPaymentByUser({ orderId: order.orderId, newStatus: statusPayment }));
            setIsModalPaidOpen(false);
        }
    };

    const confirm = async (orderId: string) => {
        await dispatch(deleteOrder(orderId));
    };

    const cancel = () => {
    };

    // useEffect
    useEffect(() => {
        dispatch(getOrders({ search: '', status: '' }));
        handleFilterOrders({ search: '', limit: numberItemPerPage.value, page: 1, status: valueStatus });
    }, []);

    useEffect(() => {
        if (success) {
            dispatch(getOrders({ search: valueSearch, status: valueStatus }));
            handleFilterOrders({ search: valueSearch, limit: numberItemPerPage.value, page: currentPage, status: valueStatus });
            if (successMessage) {
                openNotificationResetSuccess('success', successMessage);
            }
            dispatch(changeErrorToNull());
            dispatch(changeStatusSuccessToFalse());
        }
        if (error != null) {
            openNotificationResetSuccess('error', error.message);
            dispatch(changeErrorToNull());
        }
    }, [success, error]);


    return (
        <div className='manage-orders'>
            {contextHolderNoti}
            {
                userInfo.userId ?
                    <>
                        <div className='title-manage-orders'>Tất cả đơn hàng</div>
                        <div className='toolbar-order'>
                            <div className='toolbar'>
                                <div className='toolbar-left'>
                                    <div className='toolbar-item input-name'>
                                        <div className='box-input'>
                                            <SearchOutlined className='icon-input' />
                                            <input name='inputSearchOrder' value={valueSearch} onKeyPress={(e) => handleSeachOrder(e)} onChange={e => setValueSearch(e.target.value)} className="base-input" type="text" placeholder="Tìm kiếm theo tên nguời dùng"></input>
                                        </div>
                                    </div>
                                </div>
                                <div className='toolbar-right'>
                                    <div className='toolbar-item'>
                                        <Select
                                            defaultValue=""
                                            value={valueStatus}
                                            style={{ width: 120 }}
                                            onChange={handleChange}
                                            suffixIcon={<FilterOutlined style={{ fontSize: '15px', color: '#000' }} />}
                                            options={[
                                                { value: '', label: 'Tất cả' },
                                                { value: 'Unconfimred', label: changeStatusOrderToVietNameses('Unconfimred') },
                                                { value: 'Confirmed', label: changeStatusOrderToVietNameses('Confirmed') },
                                                { value: 'Processing', label: changeStatusOrderToVietNameses('Processing') },
                                                { value: 'Dispatched', label: changeStatusOrderToVietNameses('Dispatched') },
                                                { value: 'Cancelled', label: changeStatusOrderToVietNameses('Cancelled') },
                                                { value: 'Delivered', label: changeStatusOrderToVietNameses('Delivered') },
                                            ]}
                                        />
                                    </div>
                                    <div className='toolbar-item'>
                                        <CSVLink id='btnExportOrder' data={orders} filename="Tất cả đơn hàng" className="button-primary" style={{ display: 'inline-block', lineHeight: '32px' }}>Export</CSVLink>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="m-grid">
                            <table className="m-table">
                                <thead>
                                    <tr>
                                        <th className="text-table-left">
                                            <label style={{ width: '150px' }} className="text-table column-order-id ">Mã đơn hàng</label>
                                        </th>
                                        <th className="text-table-left">
                                            <label style={{ width: '150px' }} className="text-table ">Tên khách hàng</label>
                                        </th>
                                        <th className="text-table-center">
                                            <label style={{ width: '200px' }} className="text-table ">Ngày đặt</label>
                                        </th>
                                        <th className="text-table-left">
                                            <label style={{ width: '200px' }} className="text-table ">Trạng thái giao hàng</label>
                                        </th>
                                        <th className="text-table-left">
                                            <label style={{ width: '150px' }} className="text-table ">Thanh toán</label>
                                        </th>
                                        <th className="text-table-left">
                                            <label style={{ width: '150px' }} className="text-table ">Tổng tiền</label>
                                        </th>
                                        <th className="text-table-left">
                                            <label style={{ width: '200px' }} className="text-table ">Hình thức thanh toán</label>
                                        </th>
                                        <th className="text-table-right">
                                            <label style={{ width: '100px' }} className="text-table column-action ">Chức năng</label>
                                        </th>
                                    </tr>
                                </thead>
                                {
                                    (listOrderRender && listOrderRender.length > 0) ?
                                        <tbody id="tbody-table">
                                            {
                                                listOrderRender.map(orderItem => {
                                                    return (
                                                        <tr key={orderItem.orderId}>
                                                            <td className='text-table-left col-table'>{orderItem.id}</td>
                                                            <td className='text-table-left col-table'>
                                                                cuong
                                                            </td>
                                                            <td className='text-table-center col-table'>{formatDate(orderItem.createdAt)}</td>
                                                            <td className='text-table-left col-table'>
                                                                <span className={'text-status ' +
                                                                    ((orderItem.orderStatus == 'Unconfimred' || orderItem.orderStatus == 'Cancelled') ? 'cancle' :
                                                                        (orderItem.orderStatus == 'Confirmed' || orderItem.orderStatus == 'Processing') ? 'pending' : 'success')
                                                                }
                                                                    onClick={() => { openModalChageStatus(orderItem); setUserIdFirebaseOrder(orderItem.user.userId); }}
                                                                >
                                                                    <DownOutlined className='icon-expand-status' />
                                                                    {changeStatusOrderToVietNameses(orderItem.orderStatus)}
                                                                </span>
                                                            </td>
                                                            <td className='text-table-left col-table'>
                                                                <span className={'text-status ' +
                                                                    (orderItem.paymentStatus == 'Unpaid' ? 'cancle' : 'success')
                                                                }
                                                                    onClick={() => { openModalChageStatusPayment(orderItem); setUserIdFirebaseOrder(orderItem.user.userId); }}
                                                                >
                                                                    <DownOutlined className='icon-expand-status' />
                                                                    {changePaymentStatusToVietNameses(orderItem.paymentStatus)}
                                                                </span>
                                                            </td>
                                                            <td className='text-table-left col-table'>{orderItem.paymentAmount}</td>
                                                            <td className='text-tabel-left col-table'>{orderItem.paymentMethod}</td>
                                                            <td className='text-table-right col-table'>
                                                                <EyeOutlined name='btnViewDetailOrder' onClick={() => viewDetailOrder(orderItem)} className='icon-edit-order' />
                                                                <Popconfirm
                                                                    title="Xóa món ăn"
                                                                    description="Bạn có chắc chắn muốn xóa hóa đơn này?"
                                                                    onConfirm={() => confirm(orderItem.orderId)}
                                                                    onCancel={cancel}
                                                                    okText="Có"
                                                                    cancelText="Không"
                                                                >
                                                                    <span >
                                                                        <DeleteOutlined className='icon-delete-order' name='btnDeleteOrder' />
                                                                    </span>
                                                                </Popconfirm>
                                                            </td>
                                                        </tr>
                                                    );
                                                })
                                            }
                                        </tbody >
                                        : ''}
                            </table >
                        </div>
                        <div className="manage-orders-pagination">
                            {
                                orders ? <Pagination
                                    handleChangeNumberItemPerPage={onChangeNumberItemPerPage}
                                    currentPage={currentPage} handleChangePage={onPageChange}
                                    listDataTable={orders}
                                    numberItemPerPage={numberItemPerPage}
                                    siblingCount={1}
                                    optionsItemPerPage={optionsItemPerPage}
                                ></Pagination>
                                    :
                                    <></>
                            }
                        </div>

                        <div ref={componentPrint} className='order-print' style={{ position: 'absolute', top: '0%', zIndex: -1 }}>
                            {
                                (order && order.productsOrder) ?
                                    <div className="order-history" >
                                        <div className="header-order">
                                            <div className="text-payment-id">Đồ ăn việt</div>
                                            <div className="text-order-paid">Hóa đơn thanh toán</div>
                                            <div className="phone-admin">Sđt: 0702015367</div>
                                        </div>
                                        <div className='info-order-print-header'>
                                            <div className='col-order-print-header'>
                                                <div className="row-order-print-header">Ngày: {getDayMonthYear(order.createdAt)}</div>
                                                <div className="row-order-print-header">Giờ: {getHourMinuteSecond(order.createdAt)}</div>
                                                <div className="row-order-print-header">Sđt khách hàng: {order.phoneShip}</div>
                                                <div className="row-order-print-header">Địa chỉ giao hàng: {order.addressShip}</div>
                                                <div className="row-order-print-header">Hình thức thanh toán: {changePaymentStatusToVietNameses(order.paymentStatus)}</div>
                                            </div>
                                        </div>
                                        <div className="list-food-ordered">
                                            <div className="food-ordered-item first-row-ordered">
                                                <div className="name-food-ordered">Tên món</div>
                                                <div className="quantity-food-ordered">Số lượng</div>
                                                <div className="price-food-ordered">Đơn giá</div>
                                                <div className="total-money-food-ordered">Thành tiền</div>
                                            </div>
                                            {order.productsOrder.map(productOrder => {
                                                return (
                                                    <div className="food-ordered-item" key={productOrder.productOrderId}>
                                                        <div className="name-food-ordered">{productOrder.product.name}</div>
                                                        <div className="quantity-food-ordered">{productOrder.count}</div>
                                                        <div className="price-food-ordered">{productOrder.product.price}</div>
                                                        <div className="total-money-food-ordered">{productOrder.count * productOrder.product.price}</div>
                                                    </div>
                                                );
                                            })}
                                        </div>
                                        <div className="row-order">
                                            <div className="col-order">Tổng</div>
                                            <div className="col-order">{order.paymentAmount}</div>
                                        </div>
                                        <div className="footer-print" style={{ textAlign: 'center', margin: '10px 0', fontSize: '17px' }}>
                                            Cảm ơn quý khách
                                        </div>
                                    </div>
                                    :
                                    <></>
                            }

                        </div>
                        <Modal title="Thay đổi trạng thái đơn hàng" className='modal-change-status' okText={'Xác nhận'} cancelText={'Hủy'} open={isModalOpen} onOk={() => handleChangeStatus()} onCancel={handleCancel}>
                            <div className='wrap-select-change-status'>
                                {/* <label style={{ marginRight: '5px' }}>Status: </label> */}
                                <Select
                                    defaultValue={statusOrder}
                                    value={statusOrder}
                                    style={{ width: '200px' }}
                                    onChange={handleChangeSelectValue}
                                    options={[
                                        { value: 'Unconfimred', label: changeStatusOrderToVietNameses('Unconfimred') },
                                        { value: 'Confirmed', label: changeStatusOrderToVietNameses('Confirmed') },
                                        { value: 'Processing', label: changeStatusOrderToVietNameses('Processing') },
                                        { value: 'Dispatched', label: changeStatusOrderToVietNameses('Dispatched') },
                                        { value: 'Cancelled', label: changeStatusOrderToVietNameses('Cancelled') },
                                        { value: 'Delivered', label: changeStatusOrderToVietNameses('Delivered') },
                                    ]}
                                />
                            </div>
                            {loading ? <Loading></Loading> : <></>}
                        </Modal>
                        <Modal title="Thay đổi trạng thái thanh toán" className='modal-change-status' okText={'Xác nhận'} cancelText={'Hủy'} open={isModalPaidOpen} onOk={() => handleChangeStatusPayment()} onCancel={handleCancelPaid}>
                            <div className='wrap-select-change-status' style={{ width: '300px !important' }}>
                                {/* <label style={{ marginRight: '5px' }}>Payment status: </label> */}
                                <Select
                                    defaultValue={statusPayment}
                                    value={statusPayment}
                                    style={{ width: '200px' }}
                                    onChange={handleSelectStatusPayment}
                                    options={[
                                        { value: 'Unpaid', label: changePaymentStatusToVietNameses('Unpaid') },
                                        { value: 'Paid', label: changePaymentStatusToVietNameses('Paid') },
                                    ]}
                                />
                            </div>
                            {loading ? <Loading></Loading> : <></>}
                        </Modal>
                    </>
                    :
                    <div className='login-to-view-order'>Bạn chưa đăng nhập</div>
            }
            {loading ? <Loading></Loading> : <></>}
        </div>

    );
};
export default ManageOrders;