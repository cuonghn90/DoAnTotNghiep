import { useEffect, useState } from 'react';
import {
    HomeOutlined,
    LeftCircleOutlined,
    AppstoreAddOutlined,
    RightCircleOutlined,
    SettingOutlined,
    StarFilled,
    AppstoreOutlined,
    MailOutlined
} from '@ant-design/icons';
import './style.css';
import Sider from 'antd/es/layout/Sider';
import Menu from 'antd/es/menu';
import Typography from 'antd/es/typography';
import Button from 'antd/es/button';
import { useLocation, useNavigate } from 'react-router-dom';

interface IProps {
    changeNavbarSeleted: Function,
    navbarSelected: string;
}

const TheNavbar = ({ navbarSelected, changeNavbarSeleted }: IProps) => {

    // useState
    const [collapsed, setCollapsed] = useState(false);

    // useNavigate
    const navigate = useNavigate();

    // useLocation
    const location = useLocation();

    // useEffect
    useEffect(() => {
        async function handleHashChange () {
            const oldUrl = location.pathname.indexOf('/', 1);
            if (oldUrl > 0) {
                if (location.pathname.startsWith("/setting")) {
                    await changeNavbarSeleted("setting");
                }
            }
            else {
                const newUrl = location.pathname.substring(1, location.pathname.length);
                if (newUrl !== navbarSelected) {
                    await changeNavbarSeleted(newUrl);
                }
            }
        }
        handleHashChange();
    }, [location.pathname]);
    
    return (
        <Sider className='navbar' width={200} collapsedWidth={80} trigger={null} collapsible collapsed={collapsed}>
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
                        icon: <HomeOutlined />,
                        label: 'Thống kê',
                        onClick: () => {
                            changeNavbarSeleted('');
                            navigate(`/`);
                        }
                    },
                    {
                        key: 'manage-products',
                        icon: <AppstoreAddOutlined />,
                        label: 'Quản lí sản phẩm',
                        onClick: () => {
                            changeNavbarSeleted('manage-products');
                            navigate(`/manage-products`);
                        }
                    },
                    {
                        key: 'manage-orders',
                        icon: <AppstoreOutlined />,
                        label: 'Quản lí đơn hàng',
                        onClick: () => {
                            changeNavbarSeleted('manage-orders');
                            navigate(`/manage-orders`);
                        }
                    },
                    {
                        key: 'manage-categorys',
                        icon: <AppstoreOutlined />,
                        label: 'Quản lí danh mục',
                        onClick: () => {
                            changeNavbarSeleted('manage-categorys');
                            navigate(`/manage-categorys`);
                        }
                    },
                    {
                        key: 'manage-coupons',
                        icon: <AppstoreOutlined />,
                        label: 'Quản lí mã giảm giá',
                        onClick: () => {
                            changeNavbarSeleted('manage-coupons');
                            navigate(`/manage-coupons`);
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