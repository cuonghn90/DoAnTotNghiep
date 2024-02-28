import { Spin } from 'antd';
import './style.css';

const Loading = () => {
    return(
        <div className='loading'>
            <Spin size='large'></Spin>
        </div>
    )
}
export default Loading;