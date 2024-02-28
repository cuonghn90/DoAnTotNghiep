import './style.css';
import { DeleteOutlined, EditOutlined, PlusOutlined, MinusOutlined, CheckOutlined } from '@ant-design/icons';
import { useState } from 'react';
import { useAppDispatch } from 'store/hook';
import { deleteProductFromCart, pushProductToCart } from 'pages/Cart/cartSlice';
import { IProductCart } from 'interface';
import { Popconfirm } from 'antd';

interface IProps {
    productCart: IProductCart;
}
const CartItem = ({ productCart }: IProps) => {
    // store
    const dispatch = useAppDispatch();

    // useState
    const [openEditNote, setOpenEditNote] = useState(false);
    const [noteFoodOrder, setNoteFoodOrder] = useState(productCart.note || '');

    // Function
    const handleUpdateFoodOrder = async () => {
        const newProductCart: IProductCart = {
            ...productCart,
            note: noteFoodOrder
        };
        await dispatch(pushProductToCart(newProductCart));
        setOpenEditNote(false);
    };

    const handleDegreQuantity = async () => {
        if ((productCart.count) > 1) {
            const newProductCart: IProductCart = {
                ...productCart,
                count: -1,
                note: noteFoodOrder
            };
            await dispatch(pushProductToCart(newProductCart));
        }
    };

    const handleIncreQuantity = async () => {
        const newProductCart: IProductCart = {
            ...productCart,
            count: 1,
            note: noteFoodOrder
        };
        await dispatch(pushProductToCart(newProductCart));
    };

    const confirm = async (productCart: IProductCart) => {
        await dispatch(deleteProductFromCart(productCart));
    };

    const cancel = () => {
    };

    return (
        <div className='order-item'>
            <div className='order-item-left'>
                <div className='order-item-left-up'>
                    <div className='order-item-left-up-left'>
                        <div className=''>
                            <img className='order-item-left-up-image' alt='food' src={productCart.product.image}></img>
                        </div>
                        <div className='order-item-left-up-info'>
                            <span className='name-food'>{productCart.product.name}</span>
                            <span className='price-food'><span className='icon-money'>$</span>{productCart.product.price}</span>
                        </div>
                    </div>
                    <div className='order-item-quantity'>
                        <div className='icon-incre-degre-quantity' onClick={() => { handleDegreQuantity(); }}>
                            <MinusOutlined />
                        </div>
                        <div className='text-number-quantity-food'>{productCart.count}</div>
                        <div className='icon-incre-degre-quantity' onClick={() => { handleIncreQuantity(); }}>
                            <PlusOutlined />
                        </div>
                    </div>
                </div>
                <div className='order-item-left-down'>
                    <input className='order-item-note' type='text' disabled={!openEditNote} placeholder='Order Note' value={noteFoodOrder} onChange={e => setNoteFoodOrder(e.target.value)}></input>
                    {
                        openEditNote ? <CheckOutlined className='icon-note-food-order' onClick={() => handleUpdateFoodOrder()} />
                            :
                            <EditOutlined className='icon-note-food-order' onClick={() => setOpenEditNote(true)} />
                    }
                </div>
            </div>
            <div className='order-item-right'>
                <div className='order-item-right-up'>
                    <span className='total-price'><span className='icon-money'>$</span>{productCart.product.price * productCart.count}</span>
                </div>
                <div className='order-item-right-down'>
                    <div className='order-item-trash'>
                        <Popconfirm
                            title="Xóa món ăn"
                            description="Bạn có chắc chắn muốn xóa món này?"
                            onConfirm={() => confirm(productCart)}
                            onCancel={cancel}
                            okText="Có"
                            cancelText="Không"
                        >
                            <DeleteOutlined style={{ color: '#FF7CA3' }} />
                        </Popconfirm>
                    </div>

                </div>
            </div>
        </div>
    );
};
export default CartItem;