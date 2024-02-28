import './style.css';
import { useEffect, useState } from "react";
import { useAppDispatch, useAppSelector } from "store/hook";
import { Tabs, Drawer, message, Modal } from "antd";
import { ArrowLeftOutlined } from '@ant-design/icons';
import ContentHome from "./components/ContentHome";
import TabPane from "antd/es/tabs/TabPane";
import DetailFood from "components/DetailFood";
import { IProduct, IProductCart } from "interface";
import { getCommentsOfProduct, getProduct, getProducts } from "./productSlice";
import Loading from "components/Loading";
import { checkProductIsExistCart, createCart, getCartByUser, pushProductToCart, pushProductToCartAction } from "pages/Cart/cartSlice";
import { getCategorys } from 'pages/Category/categorySlice';
const Home = () => {
    // Store
    const dispatch = useAppDispatch();
    const { arrayOptionCategory2 } = useAppSelector(state => state.categoryStore);
    const userInfo = useAppSelector(state => state.authStore.userInfo);
    const cartStore = useAppSelector(state => state.cartStore);
    const { loading } = useAppSelector(state => state.productStore);
    const [payloadToModal, setPayloadToModal] = useState({} as any);

    // useState
    const [open, setOpen] = useState(false);
    const [activeTab, setActiveTab] = useState<string | undefined>(''); 
    const [optionCategory, setOptionCategory] = useState<Array<any> | undefined>([]); 
   
    // state antd
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [messageApi, contextHolder] = message.useMessage();
    const showDrawer = () => {
        setOpen(true);
    };

    const onClose = () => {
        setOpen(false);
    };

    const changeTab = (activekey: string) => {
        setActiveTab(activekey);
    };

    const showModal = () => {
        setIsModalOpen(true);
    };

    // Function
    const handleClickDetail = async(productDetail: IProduct) => {
        await dispatch(getProduct(productDetail.productId));
        await dispatch(getCommentsOfProduct(productDetail.productId))
        showDrawer();
    };

    const handleClickOrder = async (product: IProduct) => {
        if (!userInfo.userId) {
            alert("Vui longf đăng nhập trước");
        }
        else {
            const productCart: IProductCart = {
                product: product,
                note: "",
                count: 1,
                productId: product.productId,
                productCartId: "",
                cartId: cartStore.cart.cartId
            };
            if (!cartStore.cart.cartId) {
                const newCart = await dispatch(createCart());
                productCart.cartId = newCart.payload.cartId;
            }
            if (checkProductIsExistCart(product.productId, cartStore.cart)) {
                setPayloadToModal(productCart);
                showModal();
            }
            else {
                await dispatch(pushProductToCart(productCart));
                messageApi.open({
                    type: 'success',
                    content: 'Thêm vào giỏ hàng thành công!',
                });
            }
        }
    }

    const handleYesAddOrder = async () => {
        await dispatch(pushProductToCart(payloadToModal));
        messageApi.open({
            type: 'success',
            content: 'Cập nhật số lượng thành công!',
        });
        setPayloadToModal(null);
        setIsModalOpen(false);
    };

    const handleNoAddOrder = () => {
        setIsModalOpen(false);
    };

    useEffect(()=>{
        if (arrayOptionCategory2.length > 0) {
            const newListOption = [];
            for (let i = 0; i < arrayOptionCategory2.length; i++) {
                newListOption.push(arrayOptionCategory2[i]);
            }
            setOptionCategory(newListOption);
            setActiveTab(newListOption[0].value);
        }
    }, [arrayOptionCategory2])

    return (
        <>
            {contextHolder}
            <div className="home">

                <Tabs activeKey={activeTab} onChange={changeTab} className="tabs-food">
                    {
                        (optionCategory && optionCategory.length > 0) ? optionCategory.map(category => {
                            return(
                                <TabPane tab={category.label} key={category.value}>
                                    {
                                        activeTab ===  category.value  ?
                                            <ContentHome activeTab={activeTab} handleClickDetail={handleClickDetail} handleClickOrder={handleClickOrder}></ContentHome>
                                            : ''
                                    }

                                </TabPane>
                            )
                        }) :
                        ''
                    }
                </Tabs>
                <Drawer closeIcon={<ArrowLeftOutlined />} title="Chi tiết món ăn" width={'60%'} placement="right" onClose={onClose} open={open}>
                    {
                        loading ? <Loading></Loading> : <DetailFood handleClickAddToCart={handleClickOrder}></DetailFood>
                    }
                </Drawer>
                <Modal centered title={'Sản phẩm đã có trong giỏ hàng'} open={isModalOpen} cancelText={'Không'} okText={'Có'} onOk={handleYesAddOrder} onCancel={handleNoAddOrder}>
                    <p className='text-noti-food-is-exist'>Bạn có muốn tăng số lượng thêm 1 không ?</p>
                </Modal>
                {
                    loading ?
                        <Loading></Loading>
                        :
                        <>
                        </>
                }
            </div>

        </>

    );
};
export default Home;