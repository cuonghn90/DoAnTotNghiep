import './style.css'
import { Content } from 'antd/es/layout/layout';
const TheContainer = ({children}:any) => {
    return(
        <Content 
            className='container'
        >
            { children }
        </Content>
    )
} 
export default TheContainer;