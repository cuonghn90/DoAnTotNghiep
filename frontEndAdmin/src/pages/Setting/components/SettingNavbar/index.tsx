import { ChromeOutlined, UserOutlined, UnlockOutlined, WalletOutlined } from '@ant-design/icons';
import './style.css';
import { Link } from 'react-router-dom';

const listItemNavbar = [
    {
        icon: <ChromeOutlined className='icon-navbar-setting'/>,
        title: 'Giao diện',
        describe: 'Tối và Sáng, Kích thước chữ',
        value: 'appearance'
    },
    {
        icon: <UserOutlined className='icon-navbar-setting'/>,
        title: 'Cá nhân',
        describe: 'Thay đổi thông tin cá nhân',
        value: 'profile'
    },
    {
        icon: <UnlockOutlined className='icon-navbar-setting'/>,
        title: 'Bảo mật',
        describe: 'Thay đổi mật khẩu,...',
        value: 'security'
    }
];
interface Iprops{
    currentNavbar: string,
    changeCurrentNavbar: Function
}
const SettingNavbar = ({ currentNavbar, changeCurrentNavbar }: Iprops) => {
    return (
        <div className='setting-navbar'>
            <div className='setting-navbar-list'>
                {
                    listItemNavbar.map(item => {
                        return(
                            <Link key={item.value} className='navbar-item-link' to={item.value}>
                                <div
                                    className={'setting-navbar-item' + (currentNavbar == item.value ? ' active' : '')}
                                    onClick={() => changeCurrentNavbar(item.value)}
                                >
                                    <div className='navbar-item-content'>
                                        <div className="wrap-icon">
                                            <div className="icon">{item.icon}</div>
                                        </div>
                                        <div className="wrap-text">
                                            <div className="navbar-item-title">
                                                <div className="text-title">{item.title}</div>
                                            </div>
                                            <div className="navbar-item-describle">
                                                <div className="text-describle">{item.describe}</div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </Link>
                        )
                    })
                }
            </div>
        </div>
    );
};
export default SettingNavbar;