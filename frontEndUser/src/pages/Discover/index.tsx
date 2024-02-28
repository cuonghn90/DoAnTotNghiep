import './style.css';
import { Select, Drawer, message, Modal } from 'antd';
import { FilterOutlined, ArrowLeftOutlined, SearchOutlined } from '@ant-design/icons';
import Pagination from 'components/Pagination';
import Dish from 'components/Dish';
import { useEffect, useState } from 'react';
import { INumberItemPerPage, IProduct, IProductCart } from 'interface';
import DetailFood from 'components/DetailFood';
import { useAppDispatch, useAppSelector } from 'store/hook';
import Loading from 'components/Loading';
import { checkProductIsExistCart, createCart, pushProductToCart, pushProductToCartAction } from 'pages/Cart/cartSlice';
import { changeProductToNull, filterProducts, getCommentsOfProduct, getProduct, getProductByName, getProducts } from 'pages/Home/productSlice';
import { getCategorys } from 'pages/Category/categorySlice';
import { useNavigate, useParams } from 'react-router-dom';
import useQuery from 'hooks/useQuery';
import axios from 'axios';
const Discover = () => {
    // useQuery
    let query = useQuery();

    //Store
    const { userInfo } = useAppSelector(state => state.authStore);
    const { arrayOptionCategory } = useAppSelector(state => state.categoryStore);
    const { loading, listProduct, product } = useAppSelector(state => state.productStore);
    const cartStore = useAppSelector(state => state.cartStore);
    const dispatch = useAppDispatch();

    // useNavigate
    const navigate = useNavigate();

    // useParams
    let { id } = useParams();

    // useState
    const [valuePrice, setValuePrice] = useState('');
    const [valueSort, setValueSort] = useState('asc');
    const [valueSearch, setValueSearch] = useState('');
    const [currentPage, setCurrentPage] = useState(1);
    const [payloadToModal, setPayloadToModal] = useState({} as any);
    const [numberItemPerPage, setNumberItemPerPage] = useState({
        id: '1',
        label: '8 bản ghi/trang',
        value: 8
    });
    const [valueCategory, setValueCategory] = useState({ value: '', label: 'Tất cả' } as { value: string, label: string; });
    const [listFoodRender, setlistFoodRender] = useState([] as Array<IProduct>);

    // constant options item per page Pagination
    const optionsItemPerPage = [
        {
            id: '1',
            value: '8',
            label: '8 bản ghi/trang',
        },
        {
            id: '2',
            value: '16',
            label: '16 bản ghi/trang',
        },
        {
            id: '3',
            value: '24',
            label: '24 bản ghi/trang',
        },
    ];

    // state & function antd  
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [open, setOpen] = useState(false);
    const [messageApi, contextHolder] = message.useMessage();
    const showModal = () => {
        setIsModalOpen(true);
    };

    const handleYesAddOrder = () => {
        dispatch(pushProductToCart(payloadToModal));
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

    const showDrawer = () => {
        setOpen(true);
    };

    const onClose = async () => {
        navigate('/');
        setOpen(false);
        await dispatch(changeProductToNull());
    };

    // #region Function
    // Function Pagination
    const onPageChange = async (newPage: number) => {
        setCurrentPage(newPage);
        const tag = query.get("tag") != null ? query.get("tag") : '';
        navigate(`/product?search=${valueSearch}&category=${valueCategory.label}&sort=${valueSort}&limit=${numberItemPerPage.value}&page=${newPage}&sortPrice=${valuePrice}&tag=${tag}`);

        // handleFilterProducts({ search: valueSearch, limit: numberItemPerPage.value, page: newPage, category: valueCategory.value, sort: valueSort, sortPrice: valuePrice });
    };

    const onChangeNumberItemPerPage = async (newItem: INumberItemPerPage) => {
        setNumberItemPerPage({
            ...newItem
        });
        onPageChange(1);
        // await dispatch(getProducts({ search: valueSearch, category: valueCategory }));
        // handleFilterProducts({ search: valueSearch, limit: newItem.value, page: 1, category: valueCategory });
    };

    // Function Input
    const handleSeachProduct = async (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key == 'Enter') {
            onPageChange(1);
        }
    };

    // Function Select
    const handleChangeCategory = async (value: any) => {
        setValueCategory({ value: value.value, label: value.label });
        navigate(`/product?search=${valueSearch}&category=${value.label}&limit=${numberItemPerPage.value}&sort=${valueSort}&page=1&sortPrice=${valuePrice}`);
        // await dispatch(getProducts({ search: valueSearch, category: value.value }));
        // handleFilterProducts({ search: valueSearch, limit: numberItemPerPage.value, page: 1, category: value.value, sort: valueSort, sortPrice: valuePrice });
    };

    const selectChangeCategory = async (value: any) => {
        if (value.value == '') {
            navigate(`/product?search=${valueSearch}&category=${value.label}&limit=${numberItemPerPage.value}&sort=${valueSort}&page=1&sortPrice=${valuePrice}`);
        }
    };

    const handleChangePrice = async (value: any) => {
        setValuePrice(value);
        const tag = query.get("tag") != null ? query.get("tag") : '';
        navigate(`/product?search=${valueSearch}&category=${valueCategory.label}&limit=${numberItemPerPage.value}&sort=${valueSort}&page=1&sortPrice=${value}&tag=${tag}`);
        // await dispatch(getProducts({ search: valueSearch, category: valueCategory.label }));
        // handleFilterProducts({ search: valueSearch, limit: numberItemPerPage.value, page: 1, category: valueCategory.value, sort: valueSort, sortPrice: value });
    };
    const handleChangeSort = async (value: any) => {
        setValueSort(value);
        const tag = query.get("tag") != null ? query.get("tag") : '';
        navigate(`/product?search=${valueSearch}&category=${valueCategory.label}&limit=${numberItemPerPage.value}&sort=${value}&page=1&sortPrice=${valuePrice}&tag=${tag}`);
        // await dispatch(getProducts({ search: valueSearch, category: valueCategory.label }));
        // handleFilterProducts({ search: valueSearch, limit: numberItemPerPage.value, page: 1, category: valueCategory.value, sort: value, sortPrice: valuePrice });
    };

    // Function Filter Products
    const handleFilterProducts = async ({ search, limit, page, category, sort, sortPrice, tag }: any) => {
        const dataProducts = await dispatch(filterProducts({ search: search, limit: limit, page: page, category: category, sort: sort, sortPrice: sortPrice, tag: tag }));
        setlistFoodRender(dataProducts.payload);
    };
    // Function Button
    const handleClickDetail = async (productDetail: IProduct) => {
        navigate(`/product/${productDetail.name}`);
    };

    const actionGetProductByName = async (name: string) => {
        const response = await dispatch(getProductByName(name ? name : 'notfound'));
        return await (response.payload);
    };

    const handleClickOrder = async (product: IProduct) => {
        if (!userInfo.userId) {
            messageApi.open({
                type: 'info',
                content: 'Vui lòng đăng nhập trước!',
            });
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

    };
    // #endregion Function

    // use Effect
    // useEffect(() => {
    //     dispatch(getProducts({ search: '', category: '' }));
    //     handleFilterProducts({ search: '', limit: numberItemPerPage.value, page: 1, category: valueCategory.value, tag: '' });
    // }, []);

    useEffect(() => {
        if (arrayOptionCategory.length > 0) {
            const valueOption = arrayOptionCategory[0]?.value;
            setValueCategory({ value: valueOption, label: '' });
        }
    }, [arrayOptionCategory]);

    useEffect(() => {
        async function getP (name: string) {
            const response = await actionGetProductByName(name);
            dispatch(getProduct(response.productId));
            return response;
        }
        if (id && !product.productId && !open) {
           getP(id);
        }
        if (!id) {
            dispatch(changeProductToNull());
            setOpen(false);
        }
    }, [id]);

    useEffect(() => {
        if(product.productId){
            dispatch(getCommentsOfProduct(product.productId));
            showDrawer();
        }
    }, [product.productId]);

    useEffect(() => {
        const tag = query.get("tag") != null ? query.get("tag") : '';
        const search = query.get("search") != null ? query.get("search") : '';
        const categoryQuery = query.get("category");
        let category = '';
        if (categoryQuery != null) {
            arrayOptionCategory.map(option => {
                if (option.label === categoryQuery) {
                    category = option.value;
                    if (category !== valueCategory.value) {
                        setValueCategory(option);
                    }
                }
            });
        }
        const limit = query.get("limit") != null ? query.get("limit") : numberItemPerPage.value;
        const sort = query.get("sort") != null ? query.get("sort") : '';
        const page = query.get("page") != null ? query.get("page") : 1;
        dispatch(getProducts({ search: search, category: category, tag: tag }));
        handleFilterProducts({ search: search, limit: limit, page: page, category: category, sort: sort, sortPrice: valuePrice, tag: tag });

    }, [query]);
    return (
        <>
            {contextHolder}
            <div className='discover'>
                <div className="header-filter">
                    <Select
                        labelInValue
                        className='filter-option'
                        defaultValue={valueCategory.value}
                        value={valueCategory.value}
                        style={{ width: 120 }}
                        onSelect={selectChangeCategory}
                        onChange={handleChangeCategory}
                        suffixIcon={<FilterOutlined />}
                        options={arrayOptionCategory}
                    />
                    <Select
                        className='filter-option'
                        value={valuePrice}
                        defaultValue="inc"
                        style={{ width: 120 }}
                        onChange={handleChangePrice}
                        suffixIcon={<FilterOutlined />}
                        options={[
                            { value: '', label: 'Mặc định' },
                            { value: 'asc', label: 'Tăng dần' },
                            { value: 'desc', label: 'Giảm dần' }
                        ]}
                    />
                    <Select
                        className='filter-option'
                        value={valueSort}
                        defaultValue="asc"
                        style={{ width: 120 }}
                        onChange={handleChangeSort}
                        suffixIcon={<FilterOutlined />}
                        options={[
                            { value: 'asc', label: 'A -> Z' },
                            { value: 'desc', label: 'Z -> A' }
                        ]}
                    />
                    <div className='box-input'>
                        <SearchOutlined className='icon-input' />
                        <input value={valueSearch} onKeyPress={(e) => handleSeachProduct(e)} onChange={e => setValueSearch(e.target.value)} className="base-input" type="text" placeholder="Tìm kiếm theo tên món"></input>
                    </div>
                </div>
                {
                    listFoodRender.length > 0 ?
                        <>
                            <div className="main-discover">
                                {
                                    listFoodRender.map(food => {
                                        return (
                                            <div className='item-dish' key={food.productId}>
                                                <Dish foodItem={food} handleClickOrder={handleClickOrder} handleClickDetail={handleClickDetail}></Dish>
                                            </div>
                                        );
                                    })
                                }
                            </div>
                            <div className="pagination-discover">
                                <Pagination
                                    handleChangeNumberItemPerPage={onChangeNumberItemPerPage}
                                    currentPage={currentPage}
                                    handleChangePage={onPageChange}
                                    listDataTable={listProduct}
                                    numberItemPerPage={numberItemPerPage}
                                    siblingCount={1}
                                    optionsItemPerPage={optionsItemPerPage}></Pagination>
                            </div>
                            <Drawer closeIcon={<ArrowLeftOutlined />} className='drawer-detail-food' title="Chi tiết món ăn" width={'60%'} placement="right" onClose={onClose} open={open}>
                                <DetailFood handleClickAddToCart={handleClickOrder} ></DetailFood>
                            </Drawer>
                            <Modal className='modal-add-food' centered title={'Sản phẩm đã có trong giỏ hàng'} cancelText={'Không'} okText={'Có'} open={isModalOpen} onOk={handleYesAddOrder} onCancel={handleNoAddOrder}>
                                <p className='text-noti-food-is-exist'>Bạn có muốn tăng số lượng thêm 1 không ?</p>
                            </Modal>
                        </>
                        :
                        <div className='no-product-display'>Không có sản phẩm nào!</div>
                }
                {
                    loading ?
                        <Loading></Loading>
                        :
                        <></>
                }
            </div>
        </>
    );
};
export default Discover;