import { Avatar, Badge, Button, Dropdown, Popover, Space, Typography } from 'antd';
import './style.css';
import {
    UserOutlined,
    UserAddOutlined,
    LogoutOutlined,
    BellOutlined,
    MenuUnfoldOutlined,
    MenuFoldOutlined
} from '@ant-design/icons';
import { useAppDispatch, useAppSelector } from 'store/hook';
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { MenuProps } from 'antd/es/menu';
import { signOut } from 'firebase/auth';
import { auth, db } from '../../firebase/firebase';
import { collection, doc, getDoc, getDocs, onSnapshot, query, serverTimestamp, setDoc, updateDoc, where, arrayUnion } from "firebase/firestore";
import { changeSuccessToFalse, logout, refreshPage } from 'pages/Authentication/AuthenSlice';
import { Header } from 'antd/es/layout/layout';
import { getOrderByUser, setStateOpenFormAfterClickNoti } from 'pages/HistoryPage/orderSlice';
const { Title } = Typography;


interface INofitication{
    id: string,
    contentMessage: string,
    idSender: string,
    date: any,
    orderId?: string,
    avatar: string
}

interface IProps {
    collapsed: boolean,
    setCollapsed: Function,
    changeNavbarSeleted: Function
}

const TheHeader = ({ collapsed, setCollapsed, changeNavbarSeleted }: IProps) => {
    // store
    const { userInfo } = useAppSelector((state) => state.authStore);
    const dispatch = useAppDispatch();
    const navigate = useNavigate();

    // useState
    const [notifications, setNotifications] = useState([] as INofitication[])
    const [isReadNotification, setIsReadNotification] = useState(false)
    const [visiblePopver, setVisiblePopver] = useState(false)

    // Function
    const viewChangeOrder = async (orderId: string) => {
        await dispatch(getOrderByUser({ orderId: orderId }))
        await dispatch(setStateOpenFormAfterClickNoti(true))
        setVisiblePopver(false)
        navigate('/history')
    }

    // useEffect
    useEffect(() => {
        if (!userInfo.userId) {
            dispatch(refreshPage());
            dispatch(changeSuccessToFalse());
        }
    }, []);

    useEffect(() => {
        if (userInfo.userId) {
            const unsub = onSnapshot(doc(db, "notifications", userInfo?.userId), async(docNoti) => {
                let arrayNoti = [] as INofitication[]
                if (docNoti.exists() && docNoti.data().notifications) {
                    Object.entries(docNoti.data().notifications).map((itemNoti) => {
                        if(itemNoti){
                            const dataNoti = (itemNoti[1] as INofitication);
                            arrayNoti.push(dataNoti)
                        }
                    });
                    setNotifications(arrayNoti)
                    setIsReadNotification(false)
                }
            });
            
            return () => {
                unsub();
            };
        }
    }, [userInfo.userId])

    const items: MenuProps['items'] = userInfo.userId ?
        [
            {
                key: '1',
                label: (
                    <div rel="noopener noreferrer" onClick={ async() => {
                        await changeNavbarSeleted('setting')
                        await navigate('/setting/profile');
                    }}>
                        Thông tin cá nhân
                    </div>
                ),
                icon: <UserAddOutlined />,
            },
            {
                key: '2',
                label: (
                    <div rel="noopener noreferrer" onClick={async () => {
                        dispatch(logout());
                        // await signOut(auth);
                        navigate('/auth/login');
                    }}>
                        Đăng xuất
                    </div>
                ),
                icon: <LogoutOutlined />
            }
        ]
        :
        [
            {
                key: '3',
                label: (
                    <a rel="noopener noreferrer" href="/auth/login">
                        Đăng nhập
                    </a>
                ),
                icon: <UserAddOutlined />,
            },
        ];
        
    return (
        <Header className="space-align-container header" >
            <Button
                type="text"
                icon={collapsed ? <MenuUnfoldOutlined style={{ color: '#fff' }} /> : <MenuFoldOutlined style={{ color: '#fff' }} />}
                onClick={() => setCollapsed(!collapsed)}
                style={{
                    fontSize: '16px',
                    width: 64,
                    height: 64,
                }}
            />
            <div className='space-align-block' >
                <Title className='title' level={5}>Đồ ăn Việt xin chào. {userInfo.username}</Title>
            </div>
            <div className='space-align-block'> 
                <Space size='middle' align='center'>
                    <Badge dot={!isReadNotification} >
                        <Popover
                            placement="bottomRight"
                            title={<span style={{ fontSize: '20px', fontWeight: '500' }}>Thông báo</span>}
                            visible={visiblePopver}
                            content={
                                <div className='notification-list'>
                                    {
                                        notifications.length > 0 ? notifications.sort((a, b) => b.date - a.date).map(noti => {
                                            return(
                                                <div className="notification-item" key={noti.id} onClick={() => {
                                                    if(noti.orderId){
                                                        viewChangeOrder(noti.orderId)}}
                                                    }
                                                >
                                                    <div className="notification-image">
                                                        <img src={noti.avatar} alt="" className="image" />
                                                    </div>
                                                    <div className="notification-item-content" style={{ fontWeight: '500' }}>
                                                        {noti.contentMessage}
                                                    </div>
                                                </div>
                                            )
                                        })
                                        :
                                        <div className='no-notificaton'>Không có thông báo mới nào.</div>
                                    }
                                </div>
                            }
                            trigger="click">
                            <BellOutlined className='icon-bell' onClick={()=>{
                                setIsReadNotification(true); 
                                setVisiblePopver(!visiblePopver);
                                }}/>
                        </Popover>
                    </Badge>
                    <Dropdown menu={{ items }} placement="bottomLeft">
                        <Avatar src={userInfo ? userInfo.avatar : ''} style={{ backgroundColor: '#87d068', cursor: 'pointer' }} icon={<UserOutlined />} />
                    </Dropdown>
                </Space>
            </div>
        </Header>
    );
};
export default TheHeader;