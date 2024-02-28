import { useNavigate } from 'react-router-dom';
import './style.css'
const NotFound = () => {
    // useNavigate
    const navigate = useNavigate()

    // Function
    const handleBackToHome = () => {
        navigate('/')
    }
    return(
        <div className='not-found-page'>
            <div className="not-found-body">
                <div className="not-found-404">404</div>
                <div className="not-found-text">Không tìm thấy trang</div>
                <div className="not-found-btn">
                    <button className='btn-back-to-home' onClick={handleBackToHome}>Quay lại trang chủ</button>
                </div>
            </div>
        </div>
    )
}
export default NotFound;