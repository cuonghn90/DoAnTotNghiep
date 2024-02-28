import { useState } from 'react';
import './style.css';
import { CheckOutlined } from '@ant-design/icons';
const AppearanceSetting = () => {
    // useState
    const [currentTheme,setCurrentTheme] = useState('light')
    const [currentFontSize,setCurrentFontSize] = useState('15px')
    return(
        <div className='appearance-setting'>
            <div className='title-appearance'>Giao diện</div>
            <div className='appearance-option-item'>
                <div className='title-option-item'>Phông nền</div>
                <div className="list-value-option">
                    <div 
                        className={'value-theme-item' + (currentTheme == 'light' ? ' active': '')}
                        onClick={()=>setCurrentTheme('light')}
                    >
                        <div className='icon-theme-active'>
                            <CheckOutlined className='icon'></CheckOutlined>
                        </div>
                    </div>  
                    <div 
                        className={'value-theme-item' + (currentTheme == 'dark' ? ' active' : '')}
                        style={{backgroundColor:'black'}}
                        onClick={() => setCurrentTheme('dark')}
                    >
                        <div className='icon-theme-active'>
                            <CheckOutlined className='icon'></CheckOutlined>
                        </div>
                    </div>  
                </div>
            </div>
            <div className='appearance-option-item'>
                <div className='title-option-item'>Kiểu chữ</div>
                <div className="list-value-option">
                    <div 
                        className={'value-font-item' + (currentFontSize == '15px' ? ' active': '')}
                        onClick={() => setCurrentFontSize('15px')}
                        style={{width:'30px',height:'30px'}}
                    >
                        <span style={{fontSize: '15px'}}>A</span>
                    </div>  
                    <div 
                        className={'value-font-item' + (currentFontSize == '17px' ? ' active': '')}
                        onClick={() => setCurrentFontSize('17px')}
                        style={{ width: '40px', height: '40px' }}
                    >
                        <span style={{fontSize: '20px'}}>A</span>
                    </div>  
                    <div 
                        className={'value-font-item' + (currentFontSize == '20px' ? ' active': '')}
                        onClick={() => setCurrentFontSize('20px')}
                        style={{ width: '45px', height: '45px' }}
                    >
                        <span style={{fontSize: '25px'}}>A</span>
                    </div>  
                </div>
            </div>
        </div>
    )
}
export default AppearanceSetting;