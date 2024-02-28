import './style.css';
import { Progress } from 'antd';

interface IProps{
    percentPayOnline: number,
    percentPayOffline: number
}

const DashboardPercent = ({ percentPayOnline, percentPayOffline }: IProps) => {

    return (
        <div className='dashboard-percent'>
            <div className='title-dashboard-percent'>Hình thức thanh toán</div>
            <div className="dashboard-percent-content">
                <div className='process-item'>
                    <Progress type="circle" percent={Math.round(percentPayOnline * 100)} />
                    <label className='label-process-item'>Thanh toán online</label>
                </div>
                <div className='process-item'>
                    <Progress type="circle" percent={Math.round(percentPayOffline * 100)} strokeColor={'tomato'} />
                    <label className='label-process-item'>Thanh toán khi nhận hàng</label>
                </div>
            </div>
        </div>
    );
};
export default DashboardPercent;