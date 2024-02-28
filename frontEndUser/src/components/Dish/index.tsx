import Button from 'components/Button';
import './style.css'
import { IProduct } from 'interface';

interface IProps{
    handleClickDetail: Function,
    handleClickOrder: Function,
    foodItem: IProduct
}
const Dish = ({ handleClickDetail, handleClickOrder, foodItem } : IProps) => {
    return(
        <div className='dish'>
            <img className='image-dish' src={foodItem.image} alt='dish'></img>
            <div className='dish-info'>
                <span className='dish-name'>{foodItem.name}</span>
                <span className='dish-price'>{' ' + foodItem.price}</span>
            </div>
            <div className="btns-action">
                <Button btnClassName='btn-watch-detail' handleClick={()=>handleClickDetail(foodItem)}>Xem chi tiết</Button>
                <Button btnClassName='btn-add-dish' handleClick={() => {
                    handleClickOrder(foodItem)
                    }}>Đặt</Button>
            </div>
        </div>
    )
}
export default Dish;