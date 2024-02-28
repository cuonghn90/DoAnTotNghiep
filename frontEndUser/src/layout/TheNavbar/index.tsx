import { useEffect, useRef, useState } from 'react';
import {
    UsergroupAddOutlined,
    ShoppingCartOutlined,
    LeftCircleOutlined,
    HistoryOutlined,
    RightCircleOutlined,
    SettingOutlined,
    StarFilled,
    PieChartOutlined,
    MailOutlined
} from '@ant-design/icons';
import './style.css';
import { useLocation, useNavigate } from 'react-router-dom';
import Sider from 'antd/es/layout/Sider';
import { Button, Menu, Typography } from 'antd';

interface IProps {
    collapsed: boolean,
    setCollapsed: Function,
    changeNavbarSeleted: Function,
    navbarSelected: string
}


const TheNavbar = ({ collapsed, setCollapsed, navbarSelected, changeNavbarSeleted }: IProps) => {
    // useNavigate
    const navigate = useNavigate();

    // useState

    // useEffect
    useEffect(()=>{
        if ((window.innerWidth < 800)){
            setCollapsed(!collapsed)
        }
    }, [navbarSelected])
    
    const location = useLocation();

    useEffect(() => {
        async function handleHashChange () {
            const oldUrl = location.pathname.indexOf('/', 1);
            if (oldUrl > 0) {
                if (location.pathname.startsWith("/setting")) {
                    await changeNavbarSeleted("setting")
                }
                else if (location.pathname.startsWith("/product")){
                    await changeNavbarSeleted("")
                }
            }
            else {
                const newUrl = location.pathname.substring(1, location.pathname.length);
                if (location.pathname.startsWith("/product")) {
                    await changeNavbarSeleted("");
                }
                else if (newUrl !== navbarSelected) {
                    await changeNavbarSeleted(newUrl)
                }
            }
        }
        handleHashChange();
    }, [location.pathname]);

    return (
        <Sider collapsible className='navbar' width={200}
            style={(window.innerWidth < 800) ? {
                overflow: 'auto',
                height: '100vh',
                position: 'fixed',
                left: 0,
                top: 0,
                bottom: 0,
                zIndex: 100000
            } : {}} 
            collapsedWidth={(window.innerWidth < 800) ? 0 : 80} trigger={null} collapsed={collapsed}>
            <div
                className="logo">
                {
                    collapsed ? <StarFilled style={{ fontSize: '20px', color: '#fff' }} /> : <Typography style={{ color: '#fff' }}>Đồ ăn Việt</Typography>
                }
            </div>
            <Menu
                theme="dark"
                mode="inline"
                defaultSelectedKeys={[navbarSelected]}
                selectedKeys={[navbarSelected]}
                items={[
                    {
                        key: '',
                        icon: <PieChartOutlined />,
                        label: 'Trang chủ',
                        onClick: () => {
                            changeNavbarSeleted('');
                            navigate(`/`);
                        }
                    },
                    {
                        key: 'cart',
                        icon: <ShoppingCartOutlined />,
                        label: 'Đặt hàng',
                        onClick: () => {
                            changeNavbarSeleted('cart');
                            navigate(`/cart`);
                        }
                    },
                    {
                        key: 'friend',
                        icon: <UsergroupAddOutlined />,
                        label: 'Bạn bè',
                        onClick: () => {
                            changeNavbarSeleted('friend');
                            navigate(`/friend`);
                        }
                    },
                    {
                        key: 'message',
                        icon: <MailOutlined />,
                        label: 'Hộp thư',
                        onClick: () => {
                            changeNavbarSeleted('message');
                            navigate(`/message`);
                        }
                    },
                    {
                        key: 'history',
                        icon: <HistoryOutlined />,
                        label: 'Lịch sử',
                        onClick: () => {
                            changeNavbarSeleted('history');
                            navigate(`/history`);
                        }
                    },
                    {
                        key: 'setting',
                        icon: <SettingOutlined />,
                        label: 'Cài đặt',
                        onClick: () => {
                            changeNavbarSeleted('setting');
                            navigate(`/setting/appearance`);
                        }
                    },
                ]}
            />
            <Button className="btn-collapse"
                type="text"
                onClick={() => setCollapsed(!collapsed)}>
                {collapsed ? (
                    <RightCircleOutlined style={{ fontSize: '20px' }} />
                ) : (
                    <span className="flex align-center justify-center" >
                        <span className="flex align-center justify-center" style={{ marginRight: 10 }}>
                            <LeftCircleOutlined style={{ fontSize: '20px' }} />
                        </span>
                        <span> Thu gọn</span>
                    </span>
                )}
            </Button>

        </Sider>

    );
};
export default TheNavbar;