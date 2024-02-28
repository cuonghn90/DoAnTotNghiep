import './style.css';
import Dish from 'components/Dish';
import { useEffect, useState } from 'react';
import Button from 'components/Button';
import { useAppDispatch, useAppSelector } from 'store/hook';
import { IProduct } from 'interface';
import { filterProducts } from 'pages/Home/productSlice';

interface Iprops {
    handleClickDetail: Function;
    handleClickOrder: Function;
    activeTab: string | undefined;
}
const ContentHome = ({ handleClickDetail, handleClickOrder, activeTab }: Iprops) => {

    // Store
    const dispatch = useAppDispatch();

    // useState
    const numberProductPerPage = 8
    const [limitDish, setLimitDish] = useState(1);
    const [hasMoreProduct, setHasMoreProduct] = useState(false)
    const [listProductDisplay, setListProductDisplay] = useState([] as IProduct[]);

    // Function
    const increLimitDish = () => {
        setLimitDish(limitDish + 1);
        handleFilterProducts({ page: limitDish + 1, limit: numberProductPerPage, search: '', category: activeTab })
    };
    const degreLimitDish = () => {
        const prevLimit = limitDish >= 2 ? (limitDish - 1) : 1
        setLimitDish(prevLimit)
        handleFilterProducts({ page: prevLimit, limit: numberProductPerPage, search: '', category: activeTab })
    }
    const handleFilterProducts = async ({ page, limit, search, category }: any) => {
        const productsPayload = await dispatch(filterProducts({ page: page, limit: limit, search: search, category: category }));
        const productsPayload2 = await dispatch(filterProducts({ page: (page+1), limit: limit, search: search, category: category }));
        if(productsPayload2.payload.length > 0){
            setHasMoreProduct(true)
        }
        else{
            setHasMoreProduct(false)
        }
        setListProductDisplay(productsPayload.payload);
    };

    // useEffect
    useEffect(() => {
        handleFilterProducts({ page: 1, limit: numberProductPerPage, search: '', category: activeTab });
    }, [activeTab]);
    
    return (
        <div className='content-home'>
            {listProductDisplay.length > 0 ?
                <>
                    <div className='flex align-center justify-between tool-bar'>
                        <span className='title text-choose-dishes'>Chọn món</span>
                    </div>
                    <div className='grid-dish'>
                        {
                            listProductDisplay.map((product) => {
                                return (
                                    <div className='item-dish' key={product.productId}>
                                        <Dish foodItem={product} handleClickOrder={handleClickOrder} handleClickDetail={handleClickDetail}></Dish>
                                    </div>
                                );
                            })
                        }
                    </div>
                    <div className='box-btn'>
                        <Button btnClassName={'btn-show-more ' + (hasMoreProduct ? '' : 'disable')} handleClick={increLimitDish}>Tiếp</Button>
                        <Button btnClassName={'btn-show-more ' + (limitDish <= 1 ? 'disable' : '')} handleClick={degreLimitDish}>Trước</Button>
                    </div>
                </>
                :
                <div className='no-product-display'>Không có sản phẩm nào!</div>
            }
        </div>
    );
};
export default ContentHome;