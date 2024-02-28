import './style.css';
import { notification } from "antd";
import { useEffect, useState } from "react";
import SettingNavbar from "./components/SettingNavbar";
import SettingContent from "./components/SettingContent";
import { useAppDispatch, useAppSelector } from "store/hook";
import { changeErrorToNull, changeSuccessToFalse } from "pages/Authentication/AuthenSlice";
import { useLocation, useNavigate } from 'react-router-dom';
import Loading from 'components/Loading/Loading';

type NotificationType = 'success' | 'info' | 'warning' | 'error';

const Setting = () => {
    // store
    const { success, loading, successMessage, error } = useAppSelector(state => state.authStore);
    const dispatch = useAppDispatch();

    // useState
    const [currentNavbar, setCurrentNavbar] = useState('appearance');

    // state & Function antd
    const [api, contextHolder] = notification.useNotification();
    const openNotificationResetSuccess = (type: NotificationType, successMessage: string, title?: string) => {
        api[type]({
            message: title ? title : 'Thông báo',
            description: successMessage,
        });
    };

    // useNavigate
    const navigate = useNavigate();

    // useLocation
    const location = useLocation();

    // useEffect
    useEffect(() => {
        if (location.pathname.startsWith("/setting")) {
            const lastIndex = location.pathname.lastIndexOf("/");
            const url = location.pathname.substring(lastIndex + 1, location.pathname.length);
            setCurrentNavbar(url);
        }
    }, [location.pathname]);

    // useEffect
    useEffect(() => {
        if (success) {
            if (successMessage) {
                openNotificationResetSuccess('success', successMessage);
            }
            dispatch(changeSuccessToFalse());
        }
        if (error != null) {
            openNotificationResetSuccess('error', error.message, 'Lỗi');
            dispatch(changeErrorToNull());
        }
    }, [success, error]);


    return (
        <div className="setting">
            {contextHolder}
            <SettingNavbar currentNavbar={currentNavbar} changeCurrentNavbar={setCurrentNavbar}></SettingNavbar>
            <SettingContent currentNavbar={currentNavbar}></SettingContent>
            {
                loading ? <Loading></Loading> : ''
            }
        </div>
    );
};
export default Setting;