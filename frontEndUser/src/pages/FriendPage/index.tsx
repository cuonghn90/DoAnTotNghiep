import { Modal, Select, Tag, notification } from 'antd';
import './style.css';
import { SearchOutlined, UserSwitchOutlined, UserAddOutlined, CheckCircleOutlined, CloseCircleOutlined } from '@ant-design/icons';
import bg from 'assets/images/bg.jpg';
import Button from 'components/Button';
import { useEffect, useRef, useState } from 'react';
import { getPaymentConfig } from 'pages/Cart/cartSlice';
import { PayPalButton } from 'react-paypal-button-v2';
import { useAppDispatch, useAppSelector } from 'store/hook';
import { acceptRequestFriend, addFriend, changeErrorToNull, changeFriendToNull, changeStatusSuccessToFalse, declineInvited, deleteFriend, getFriend, getFriends, searchUsersAndFriend, updateNumberGiveGift } from './friendSlice';
import { IBaseUser, IFriend } from 'interface';
import { giveCoupon } from 'pages/Setting/components/MyCoupon/couponSlice';

const styleButtonPayPal = { "layout": "horizontal", "height": 32 };
type NotificationType = 'success' | 'info' | 'warning' | 'error';

const FriendPage = () => {
    // Store
    const dispatch = useAppDispatch();
    const { userInfo } = useAppSelector(state => state.authStore);
    const { friends, friend, success, error, loading, successMessage } = useAppSelector(state => state.friendStore);

    // useState
    const [modelAddFriend, setModelAddFriend] = useState(false);
    const [modelGiveVoucher, setModelGiveVoucher] = useState(false);
    const [modelDeleteFriend, setModelDeleteFriend] = useState(false);
    const [modelRequestAddFriend, setModelRequestAddFriend] = useState(false);
    const [sdkReady, setSdkReady] = useState(false);
    const [typeVoucher, setTypeVoucher] = useState('10');
    const [valueSearchUserNoFriend, setValueSearchUserNoFriend] = useState('');
    const [dataSearchUser, setDateSearchUser] = useState([] as IFriend[]);

    // state & function antd
    const [api, contextHolder] = notification.useNotification();

    const openNotificationResetSuccess = (type: NotificationType, successMessage: string, title?: string) => {
        api[type]({
            message: title ? title : 'Thông báo',
            description: successMessage,
        });
    };

    // useRef 
    const paypalButton = useRef<any>();

    // Function
    const handleChange = (value: string) => {
        setTypeVoucher(value);
    };

    const handleSearchNoFriend = async (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key == 'Enter') {
            const dataSearch = await dispatch(searchUsersAndFriend(valueSearchUserNoFriend));
            setDateSearchUser(dataSearch.payload);
        }
    };

    const handleRequestAddFriend = async (dataFriend: IFriend) => {
        if (dataFriend?.sendRequest && !dataFriend?.isFriend) {
            if (dataFriend?.userId == userInfo.userId) {
                if (dataFriend?.userFriendInfo?.userId) {
                    await dispatch(declineInvited(dataFriend?.userFriendInfo?.userId));
                    const dataSearch = await dispatch(searchUsersAndFriend(valueSearchUserNoFriend));
                    setDateSearchUser(dataSearch.payload);
                }
            }
            else {
                if (dataFriend?.userFriendInfo?.userId) {
                    await dispatch(acceptRequestFriend(dataFriend?.userFriendInfo?.userId));
                    const dataSearch = await dispatch(searchUsersAndFriend(valueSearchUserNoFriend));
                    setDateSearchUser(dataSearch.payload);
                }
            }
        }
        else if (!dataFriend?.sendRequest && !dataFriend?.isFriend) {
            if (dataFriend?.userFriendInfo?.userId) {
                await dispatch(addFriend(dataFriend?.userFriendInfo?.userId));
                const dataSearch = await dispatch(searchUsersAndFriend(valueSearchUserNoFriend));
                setDateSearchUser(dataSearch.payload);
            }
        }
    };

    const handleAcceptRequest = async (userFriendId?: string) => {
        if (userFriendId) {
            await dispatch(acceptRequestFriend(userFriendId));
        }
    };

    const handleDeclineRequest = async (userFriendId?: string) => {
        if (userFriendId) {
            await dispatch(declineInvited(userFriendId));
        }
    };

    const handleDeleteFriend = async () => {
        if (friend && friend.userFriendInfo) {
            await dispatch(deleteFriend(friend.userFriendInfo.userId));
            await dispatch(changeFriendToNull());
            setModelDeleteFriend(false);
        }
    };

    const handleCloseModelAddFriend = async () => {
        setValueSearchUserNoFriend('');
        setDateSearchUser([] as IFriend[]);
        setModelAddFriend(false);
    };

    const handleViewProfileFriend = async (userFriendId?: string) => {
        if (userFriendId) {
            await dispatch(getFriend(userFriendId));
        }
    };

    const handleGiveCoupon = async () => {
        if (friend && friend.userFriendInfo) {
            await dispatch(giveCoupon({ discount: typeVoucher, takeBy: friend.userFriendInfo?.username }));
            await dispatch(updateNumberGiveGift(friend.userFriendInfo.userId))
            setModelGiveVoucher(false)
        }
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
            dispatch(getFriends());
            dispatch(changeFriendToNull());
        }
    }, [userInfo.userId]);

    useEffect(() => {
        if (success) {
            if (successMessage) {
                openNotificationResetSuccess('success', successMessage);
            }
            dispatch(getFriends());
            dispatch(changeStatusSuccessToFalse());
            dispatch(changeErrorToNull());
        }
        if (error != null) {
            openNotificationResetSuccess('error', error.message, 'Lỗi');
            dispatch(changeErrorToNull());
        }
    }, [success, error]);
    return (
        <div className='friend-page'>
            {contextHolder}
            {userInfo.userId ? 
            <>
                <div className="navbar-friend-page">
                    <div className="tool-navbar-friend">
                        <div className="wrap-search-friend">
                            <div className='box-input' style={{ width: '100%' }}>
                                <SearchOutlined className='icon-input' style={{ color: '#fff' }} />
                                <input style={{ width: '100%' }} className="base-input" type="text" placeholder="Tìm kiếm bạn bè" ></input>
                            </div>
                        </div>
                        <div className="wrap-request-friend">
                            <div className="item-request btn-add-friend">
                                <Tag icon={<UserAddOutlined />} className='tag-request' color="#3b5999" onClick={() => setModelAddFriend(true)}>
                                    Thêm bạn bè
                                </Tag>
                            </div>
                            <div className="item-request request-add-friend">
                                <Tag icon={<UserSwitchOutlined />} className='tag-request' color="#3b5999" onClick={() => setModelRequestAddFriend(true)}>
                                    Yêu cầu xác nhận ({[...friends.filter(friendItem => (!friendItem.isFriend && userInfo.userId !== friendItem?.userId))].length})
                                </Tag>
                            </div>
                        </div>
                    </div>
                    <div className="list-friend">
                        {
                            (friends && [...friends.filter(friendItem => friendItem.isFriend)].length > 0) ?
                                [...friends.filter(friendItem => friendItem.isFriend)].map(friendItem => {
                                    return (
                                        <div
                                            className={"info-friend " + ((friend && friend.userFriendId && friend.userFriendInfo?.userId == friendItem.userFriendInfo?.userId) ? 'active' : '')}
                                            key={friendItem.id} onClick={() => handleViewProfileFriend(friendItem?.userFriendInfo?.userId)}>
                                            <div className="wrap-avatar-friend">
                                                <img src={friendItem?.userFriendInfo?.avatar} alt="avatar" className='image-friend' />
                                            </div>
                                            <div className="wrap-info-base-friend">
                                                <span className="name-friend">{friendItem?.userFriendInfo?.username}</span>
                                            </div>
                                        </div>
                                    );
                                })

                                :
                                <div className='no-friend'>Chưa có bạn bè nào.</div>
                        }
                    </div>
                </div>
                <div className="content-friend-page">
                    {
                        (friend && friend.id) ?
                            <div className="wrap-detail-info-friend">
                                <div className="header-detail-info">
                                    <div className="wrap-image-detail-info">
                                        <img src={friend?.userFriendInfo?.avatar} alt="avatar" className='image-detail-info' />
                                    </div>
                                    <div className="center-header-detail">
                                        <div className="header-detail-name">{friend?.userFriendInfo?.username}</div>
                                        <div className="header-detail-give-voucher">
                                            <button className='button-primary' onClick={() => setModelGiveVoucher(true)}>Tặng voucher</button>
                                        </div>
                                    </div>
                                    <div className="more-action-header"></div>
                                </div>
                                <div className="main-detail-info-friend">
                                    <div className="row-detail-info-friend">
                                        <div className="col-detail-info-friend">
                                            <label>Họ</label>
                                            <div className="text-info-friend col-detail-info-frist-name">{friend?.userFriendInfo?.firstname}</div>
                                        </div>
                                        <div className="col-detail-info-friend">
                                            <label>Tên</label>
                                            <div className="text-info-friend col-detail-info-last-name">{friend?.userFriendInfo?.lastname}</div>
                                        </div>
                                    </div>
                                    <div className="row-detail-info-friend">
                                        <div className="col-detail-info-friend">
                                            <label>Tên tài khoản</label>
                                            <div className="text-info-friend col-detail-info-username">{friend?.userFriendInfo?.username}</div>
                                        </div>
                                        <div className="col-detail-info-friend">
                                            <label>Số điện thoại</label>
                                            <div className="text-info-friend col-detail-info-phone">{friend?.userFriendInfo?.phone}</div>
                                        </div>
                                    </div>
                                    <div className="row-detail-info-friend">
                                        <div className="col-detail-info-friend">
                                            <label>Địa chỉ</label>
                                            <div className="text-info-friend col-detail-info-address">{friend?.userFriendInfo?.address}</div>
                                        </div>
                                    </div>
                                </div>
                                <div className="footer-detail-info">
                                    <button className='button-primary btn-delete-friend' onClick={() => setModelDeleteFriend(true)}>Xóa bạn</button>
                                </div>
                            </div>
                            :
                            <div className='no-detail-info-friend'>Chọn bạn để xem thông tin</div>
                    }

                </div>
                <Modal
                    title="Thêm bạn bè"
                    className='model-add-friend'
                    centered
                    open={modelAddFriend}
                    footer={[
                        <Button key="back" handleClick={() => handleCloseModelAddFriend()}>
                            Đóng
                        </Button>,
                    ]}
                    onCancel={() => handleCloseModelAddFriend()}
                >
                    <div className='box-input' style={{ width: '100%' }}>
                        <SearchOutlined className='icon-input' style={{ color: '#fff' }} />
                        <input value={valueSearchUserNoFriend} onChange={e => setValueSearchUserNoFriend(e.target.value)} onKeyPress={(e) => handleSearchNoFriend(e)} className='input-search-add-friend' placeholder='Nhập tên người cần tìm'></input>
                    </div>
                    <div className="list-friend-searched">
                        {
                            (dataSearchUser && dataSearchUser.length > 0) ?
                                dataSearchUser.map(dataSearch => {
                                    return (
                                        <div className="friend-searched-item" key={dataSearch?.userFriendInfo?.userId}>
                                            <div className="wrap-left-friend-searched-item">
                                                <div className="wrap-item-friend-searched">
                                                    <img src={dataSearch?.userFriendInfo?.avatar} alt="avatar" />
                                                </div>
                                                <div className="name-item-friend-searched">
                                                    {dataSearch?.userFriendInfo?.username}
                                                </div>
                                            </div>
                                            <div className="wrap-right-friend-searched-item">
                                                {dataSearch?.isFriend}
                                                <button
                                                    onClick={() => handleRequestAddFriend(dataSearch)}
                                                    className={'button-primary ' + (dataSearch?.isFriend ? 'disable' : '')}>
                                                    {(dataSearch?.isFriend) ? 'Đã là bạn bè' : ((!dataSearch?.sendRequest) ? 'Kết bạn' : (dataSearch?.userId == userInfo.userId ? 'Hủy lời mời' : 'Chấp nhận'))}
                                                </button>
                                            </div>
                                        </div>
                                    );
                                })
                                :
                                <></>
                        }

                    </div>
                </Modal>
                <Modal
                    title="Lời mời kết bạn"
                    className='model-request-add-friend'
                    centered
                    open={modelRequestAddFriend}
                    footer={[
                        <Button key="back" handleClick={() => setModelRequestAddFriend(false)}>
                            Đóng
                        </Button>,
                    ]}
                    onCancel={() => setModelRequestAddFriend(false)}
                >
                    {/* <div className='box-input' style={{ width: '100%' }}>
                    <SearchOutlined className='icon-input' style={{ color: '#fff' }} />
                    <input className='input-search-add-friend' placeholder='Nhập tên người cần tìm'></input>
                </div> */}
                    <div className="list-friend-searched">
                        {
                            (friends && [...friends.filter(friendItem => (!friendItem.isFriend && userInfo.userId !== friendItem.userId))].length > 0) ?
                                [...friends.filter(friendItem => (!friendItem.isFriend && userInfo.userId !== friendItem.userId))].map(friendItem => {
                                    return (
                                        <div className="friend-searched-item" key={friendItem?.id}>
                                            <div className="wrap-left-friend-searched-item">
                                                <div className="wrap-item-friend-searched">
                                                    <img src={friendItem?.userFriendInfo?.avatar} alt="avatar" />
                                                </div>
                                                <div className="name-item-friend-searched">
                                                    {friendItem?.userFriendInfo?.username}
                                                </div>
                                            </div>
                                            <div className="wrap-right-friend-searched-item">
                                                <CheckCircleOutlined className='icon-request accept' onClick={() => handleAcceptRequest(friendItem.userFriendInfo?.userId)} />
                                                <CloseCircleOutlined className='icon-request delete' onClick={() => handleDeclineRequest(friendItem.userFriendInfo?.userId)} />
                                            </div>
                                        </div>
                                    );
                                })
                                :
                                <div>Không có lời mời kết bạn nào.</div>
                        }
                    </div>
                </Modal>
                <Modal centered className='modal-delete-friend' title="Xóa bạn" open={modelDeleteFriend} onOk={() => handleDeleteFriend()} onCancel={() => setModelDeleteFriend(false)} okText='Có' cancelText='Hủy'>
                    <p>Bạn chắc chẳn muốn xóa bạn không?</p>
                </Modal>
                <Modal centered className='modal-give-voucher-friend' title="Tặng voucher" open={modelGiveVoucher}
                    onOk={() => paypalButton.current.click()} onCancel={() => setModelGiveVoucher(false)} okText='Xác nhận' cancelText='Hủy'
                    footer={[
                        <Button key="back" handleClick={() => setModelRequestAddFriend(false)}>
                            Hủy
                        </Button>,
                        <div style={{ marginLeft: '10px', maxWidth: '150px', maxHeight: '45px', overflow: 'hidden' }}>
                            <PayPalButton
                                style={styleButtonPayPal}
                                createOrder={(data: any, actions: any) => actions.order.create({
                                    purchase_units: [
                                        {
                                            amount: {
                                                currency_code: "USD",
                                                value: parseFloat((parseInt(typeVoucher) * 100).toString()),
                                                breakdown: {
                                                    item_total: {
                                                        currency_code: "USD",
                                                        value: parseFloat((parseInt(typeVoucher) * 100).toString())
                                                    }
                                                }
                                            },
                                            items: [{
                                                name: 'give voucher',
                                                unit_amount: { currency_code: 'USD', value: parseFloat((parseInt(typeVoucher) * 100).toString()) },
                                                quantity: 1
                                            }
                                            ]
                                        }
                                    ]
                                }).then((orderId: any) => orderId)}
                                onApprove={(data: any, actions: any) => actions.order.capture().then(async (response: any) => {
                                    await handleGiveCoupon();
                                })}
                                onError={(error: any) => {
                                    console.log(error);
                                }}
                            />
                        </div>
                    ]}
                >
                    <label htmlFor="give-voucher-select">Chọn loại voucher: </label>
                    <Select
                        id='give-voucher-select'
                        defaultValue={typeVoucher}
                        style={{ width: 'fit-content' }}
                        value={typeVoucher}
                        onChange={handleChange}
                        options={[
                            { value: '10', label: 'Giảm giá 10%' },
                            { value: '20', label: 'Giảm giá 20%' },
                            { value: '30', label: 'Giảm giá 30%' },
                            { value: '50', label: 'Giảm giá 50%' },
                        ]}
                    />
                    <div className="total-voucher">
                        Giá: <b>{parseInt(typeVoucher) * 100}</b>
                    </div>

                </Modal>
            </>
            :
                <div className='you-not-login'>Bạn chưa đăng nhập</div>
            }
        </div>
    );
};

export default FriendPage;