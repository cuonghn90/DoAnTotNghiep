import './style.css';
import { useEffect, useRef, useState } from 'react';
import { Select, Modal, notification } from "antd";
import { SearchOutlined } from '@ant-design/icons';
import { FilterOutlined } from '@ant-design/icons';
import TableFood from "./components/TableFood";
import Pagination from "components/Pagination/Pagination";
import Button from 'components/Button/Button';
import FormAddOrEditFood from './components/FormAddOrEditFood';
import { IProduct } from 'interface';
import { useAppDispatch, useAppSelector } from 'store/hook';
import { changeErrorToNull, changeProductToNull, changeStatusSuccessToFalse, filterProducts, getProduct, getProducts, importFileExcel } from './productSlice';
import { FormikProps } from "formik";import axios from 'axios';
import { getCategorys } from 'pages/Category/categorySlice';
;
export interface INumberItemPerPage {
    id: string,
    label: string,
    value: number;
}

type NotificationType = 'success' | 'info' | 'warning' | 'error';

const ManageFood = () => {

    //Store
    const { userInfo } = useAppSelector(state => state.authStore);
    const { arrayOptionCategory, arrayOptionCategory2 } = useAppSelector(state => state.categoryStore);
    const { loading, success, error, successMessage, listFood, product } = useAppSelector(state => state.productStore);
    const dispatch = useAppDispatch();

    // useRef
    const inputSubmitRef = useRef<HTMLInputElement>(null);
    const formRef = useRef<FormikProps<any>>(null);

    // useState
    const [valueCategory, setValueCategory] = useState<string | undefined>('');
    const [listFoodRender, setlistFoodRender] = useState([] as Array<IProduct>);
    const [valueSearch, setValueSearch] = useState('');
    const [currentPage, setCurrentPage] = useState(1);
    const [numberItemPerPage, setNumberItemPerPage] = useState({
        id: '1',
        label: '10 bản ghi/trang',
        value: 10
    });

    // constant options item per page Pagination
    const optionsItemPerPage = [
        {
            id: '1',
            label: '10 bản ghi/trang',
            value: 10
        },
        {
            id: '2',
            value: '20',
            label: '20 bản ghi/trang',
        },
        {
            id: '3',
            value: '30',
            label: '30 bản ghi/trang',
        },
    ];

    // state Antd
    const [api, contextHolderNoti] = notification.useNotification();
    const [isModalOpen, setIsModalOpen] = useState(false);
    const openNotificationResetSuccess = (type: NotificationType, successMessage: string) => {
        api[type]({
            message: 'Thông báo',
            description: successMessage,
        });
    };

    // #region Function
    // Function Modal 
    const showModal = () => {
        setIsModalOpen(true);
    };

    const handleCloseModal = () => {
        if (formRef.current !== null) {
            formRef.current.resetForm();
        }
        dispatch(changeProductToNull());
        setIsModalOpen(false);
    };

    const handleOk = () => {
        if (inputSubmitRef.current !== null) {
            inputSubmitRef.current?.click();
        }
    };

    const changeProductEditAndOpenModal = async (productId: string) => {
        await dispatch(getProduct(productId));
        showModal();
    };

    const openNewForm = () => {
        dispatch(changeProductToNull());
        showModal();
    };


    // Function Pagination
    const onPageChange = async (newPage: number) => {
        setCurrentPage(newPage);
        handleFilterProducts({ search: valueSearch, limit: numberItemPerPage.value, page: newPage , category: valueCategory})
    };

    const onChangeNumberItemPerPage = async(newItem: INumberItemPerPage) => {
        setNumberItemPerPage({
            ...newItem
        });
        setCurrentPage(1)
        await dispatch(getProducts({ search: valueSearch, category: valueCategory }));
        handleFilterProducts({ search: valueSearch, limit: newItem.value, page: 1, category: valueCategory })
    };

    // Function Input
    const handleSeachProduct = async (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key == 'Enter') {
            await dispatch(getProducts({ search: valueSearch, category: '' }));
            onPageChange(1)
        }
    };

    // Function Select
    const handleChange = async(value: string) => {
        setValueCategory(value)
        setCurrentPage(1)
        await dispatch(getProducts({ search: valueSearch, category: value }));
        handleFilterProducts({ search: valueSearch, limit: numberItemPerPage.value, page: 1, category: value })
    };

    const handleFilterProducts = async ({ search, limit, page, category }: any) =>{
        const dataProducts = await dispatch(filterProducts({ search: search, limit: limit, page: page, category: category }))
        setlistFoodRender(dataProducts.payload)
    }

    // Function  Upload File
    const uploadAction = async (event: React.ChangeEvent<HTMLInputElement>) => {
        let filesRaw: any = event.currentTarget as EventTarget;
        const files = filesRaw.files;
        var dataExcel = new FormData()
        var excelFile = files[0];
        dataExcel.append("fileName", excelFile);
        await dispatch(importFileExcel(dataExcel))
    }
    // #endregion Funtion

    // useEffect
    useEffect(() => {
        if (arrayOptionCategory.length > 0) {
            const valueOption = arrayOptionCategory2[0]?.value;
            setValueCategory(valueOption);
        }
        dispatch(getProducts({ search: '', category: '' }));
        handleFilterProducts({ search: '', limit: numberItemPerPage.value, page: 1, category: valueCategory })
    }, []);

    useEffect(() => {
        if (success) {
            handleCloseModal();
            dispatch(getProducts( { search: valueSearch, category: valueCategory }));
            handleFilterProducts({ search: valueSearch, limit: numberItemPerPage.value, page: currentPage, category: valueCategory })
            if (successMessage) {
                openNotificationResetSuccess('success', successMessage);
            }
            dispatch(changeErrorToNull());
            dispatch(changeStatusSuccessToFalse());
            dispatch(changeProductToNull());
        }
        if (error != null) {
            openNotificationResetSuccess('error', error.message);
            dispatch(changeErrorToNull());
        }
    }, [success, error]);

    return (
        <div className="manage-food">
            {userInfo.userId ?
                <>
                    {contextHolderNoti}
                    <div className="manage-food-header">
                        <div></div>
                        <div className="btn-add-food">
                            <Button handleClick={openNewForm}>Thêm mới sản phẩm</Button>
                        </div>
                    </div>
                    <div className="manage-food-toolbar">
                        <Select
                            defaultValue={valueCategory}
                            value={valueCategory}
                            style={{ width: 120 }}
                            onChange={handleChange}
                            suffixIcon={<FilterOutlined style={{ fontSize: '15px', color: '#000' }} />}
                            options={arrayOptionCategory2}
                        />
                        <div className="input-search-food" >
                            <div className='box-input'>
                                <SearchOutlined className='icon-input' />
                                <input value={valueSearch} onKeyPress={(e) => handleSeachProduct(e)} onChange={e => setValueSearch(e.target.value)} className="base-input" type="text" placeholder="Tìm kiếm theo tên món"></input>
                            </div>
                        </div>
                    </div>
                    <div className="manage-food-table">
                        <TableFood changeProductEditAndOpenModal={changeProductEditAndOpenModal} listFood={listFoodRender} isLoading={loading}></TableFood>
                    </div>
                    <div className="manage-food-pagination">
                        <Pagination
                            handleChangeNumberItemPerPage={onChangeNumberItemPerPage}
                            currentPage={currentPage}
                            handleChangePage={onPageChange}
                            listDataTable={listFood}
                            numberItemPerPage={numberItemPerPage}
                            siblingCount={1}
                            optionsItemPerPage={optionsItemPerPage}
                        ></Pagination>
                    </div>
                    <Modal title={<div style={{ display: 'flex', alignItems: 'center' }}>
                        <span style={{ marginRight: '10px' }}>{product.productId ? 'Sửa thông tin sản phẩm' : 'Thêm sản phẩm'}</span>
                        <label className='btn-upload button-primary' htmlFor="excel-food">Import món ăn</label>
                        <input id="excel-food" type="file" name="image"
                            style={{ display: 'none' }}
                            onChange={(event) => {
                                uploadAction(event);
                            }}
                        />
                    </div>} open={isModalOpen} onOk={handleOk} onCancel={handleCloseModal} okText='Lưu' cancelText='Hủy'>
                        <FormAddOrEditFood formRef={formRef} productEdit={product} handleCloseModal={handleCloseModal} inputSubmitRef={inputSubmitRef} />
                    </Modal>
                </>
                :
                <div className='login-to-view-product'>Bạn chưa đăng nhập</div>
            }

        </div>
    );
};
export default ManageFood;