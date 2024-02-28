import './style.css'
import bg from 'assets/images/bg.jpg'
import { useEffect } from 'react';
import { Outlet } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from 'store/hook';
import { changeErrorToNull, changeSuccessToFalse } from './AuthenSlice';
import Loading from 'components/Loading/Loading';
import { notification } from 'antd';

type NotificationType = 'success' | 'info' | 'warning' | 'error';

const Authentication = () => {
    // store
    const dispatch = useAppDispatch()
    const { loading, success, successMessage, error } = useAppSelector((state) => state.authStore);

    // state & function antd
    const [api, contextHolder] = notification.useNotification();
    const openNotificationResetSuccess = (type: NotificationType, successMessage: string, title?: string) => {
        api[type]({
            message: title ? title : 'Thông báo',
            description: successMessage,
        });
    };

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
        <div className='authentication'>
            {contextHolder}
            <img src={bg} alt="" className="bg" />
            <Outlet></Outlet>
            {
                loading ? <Loading></Loading> : ''
            }
        </div>
    );
};
export default Authentication;