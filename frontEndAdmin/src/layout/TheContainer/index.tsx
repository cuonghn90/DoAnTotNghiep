import { Content } from 'antd/es/layout/layout';
import './style.css';
const TheContainer = ({ children }: any) => {
    return (
        <Content
            className='container'
        >
            {children}
        </Content>
    );
};
export default TheContainer;