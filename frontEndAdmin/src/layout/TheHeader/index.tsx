import './style.css';
import { useEffect, useState } from 'react';
import {
    UserOutlined,
    UserAddOutlined,
    LogoutOutlined,
    BellOutlined
} from '@ant-design/icons';
import { Avatar, Badge, Dropdown, Popover, Space } from 'antd';
import { MenuProps } from 'antd/es/menu';
import { Header } from 'antd/es/layout/layout';
import { useNavigate } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from 'store/hook';
import { changeSuccessToFalse, logout, refreshPage } from 'pages/Authentication/AuthenSlice';
import { signOut } from 'firebase/auth';
import { auth, db } from '../../firebase/firebase';
import { doc, onSnapshot, } from "firebase/firestore";
interface IProps {
    changeNavbarSeleted: Function;
}

interface INofitication {
    id: string,
    contentMessage: string,
    idSender: string,
    date: any,
    avatar: string
}

const TheHeader = ({ changeNavbarSeleted }: IProps) => {
    // store
    const { userInfo } = useAppSelector((state) => state.authStore);
    const dispatch = useAppDispatch();

    // useState
    const [notifications, setNotifications] = useState([] as INofitication[]);
    const [isReadNotification, setIsReadNotification]  = useState(false)
    const [openPopover, setOpenPopover] = useState(false);

    // useNavigate
    const navigate = useNavigate();

    // Function
    const hide = () => {
        setOpenPopover(false);
    };

    const handleOpenChange = (newOpen: boolean) => {
        setOpenPopover(newOpen);
    };

    // useEffect
    useEffect(() => {
        async function callRefreshPage () {
            await dispatch(refreshPage());
        }
        if (!userInfo.userId) {
            callRefreshPage();
            dispatch(changeSuccessToFalse());
        }
    }, []);

    useEffect(() => {
        if (userInfo.userId) {
            const unsub = onSnapshot(doc(db, "notifications", 'admin'), async (docNoti) => {
                let arrayNoti = [] as INofitication[];
                if (docNoti.exists()) {
                    if (docNoti.data().notifications) {
                        Object.entries(docNoti.data().notifications).map((itemNoti) => {
                            if (itemNoti) {
                                const dataNoti = (itemNoti[1] as INofitication);
                                arrayNoti.push(dataNoti);
                            }
                        });
                        setNotifications(arrayNoti);
                        setIsReadNotification(false)
                    }
                }
            });

            return () => {
                unsub();
            };
        }
    }, [userInfo.userId]);

    const items: MenuProps['items'] = userInfo.userId ?
        [
            {
                key: '1',
                label: (
                    <div rel="noopener noreferrer" onClick={async () => {
                        await changeNavbarSeleted('setting');
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
                key: '1',
                label: (
                    <a rel="noopener noreferrer" href="/auth/login">
                        Đăng nhập
                    </a>
                ),
                icon: <UserAddOutlined />,
            },
        ];
    return (
        <Header className="header" >
            <div className='space-align-block' >
                <h3>Đồ ăn Việt xin chào {userInfo?.username}.</h3>
            </div>
            <div className='space-align-block'>
                <Space size='middle' align='center'>
                    <Badge dot={!isReadNotification}>
                        <Popover
                            placement="bottomRight"
                            title={<span style={{ fontSize: '20px', fontWeight: '500' }}>Thông báo</span>}
                            content={
                                <div className='notification-list'>
                                    {
                                        notifications.length > 0 ? notifications.sort((a, b) => b.date - a.date).map(noti => {
                                            return (
                                                <div className="notification-item" key={noti.id}>
                                                    <div className="notification-image">
                                                        <img src={noti.avatar} alt="" className="image" />
                                                    </div>
                                                    <div className={"notification-item-content" + (isReadNotification ? ' readed': '')} style={{ fontWeight: '500' }}>
                                                        {noti.contentMessage}
                                                    </div>
                                                </div>
                                            );
                                        })
                                            :
                                            <div className='no-notificaton'>Không có thông báo mới nào.</div>
                                    }
                                </div>
                            }
                            trigger="click"
                            open={openPopover}
                            onOpenChange={handleOpenChange}
                            >
                            <BellOutlined className='icon-bell' onClick={()=>setIsReadNotification(true)}/>
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