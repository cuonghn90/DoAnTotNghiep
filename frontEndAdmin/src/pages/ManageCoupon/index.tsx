import './style.css';
import { useEffect, useRef, useState } from 'react';
import { Select, Modal, notification } from "antd";
import { SearchOutlined } from '@ant-design/icons';
import { FilterOutlined } from '@ant-design/icons';
import TableCoupon from './components/TableCoupon';
import Pagination from "components/Pagination/Pagination";
import Button from 'components/Button/Button';
import FormCoupon from './components/FormCoupon';
import { ICoupon, IProduct } from 'interface';
import { useAppDispatch, useAppSelector } from 'store/hook';
import { changeErrorToNull, changeCouponToNull, changeStatusSuccessToFalse, filterCoupons, getCoupon, getCoupons } from './couponSlice';
import { FormikProps } from "formik"; 
import { DatePicker } from 'antd';
import { formatDateFullYear } from 'utils/uitls';

export interface INumberItemPerPage {
    id: string,
    label: string,
    value: number;
}

type NotificationType = 'success' | 'info' | 'warning' | 'error';
const { RangePicker } = DatePicker;
const ManageCoupon = () => {

    //Store
    const { userInfo } = useAppSelector(state => state.authStore);
    const { arrayOptionCategory, arrayOptionCategory2 } = useAppSelector(state => state.categoryStore);
    const { loading, success, error, successMessage, listCoupon, coupon } = useAppSelector(state => state.couponStore);
    const dispatch = useAppDispatch();

    // useRef
    const inputSubmitRef = useRef<HTMLInputElement>(null);
    const formRef = useRef<FormikProps<any>>(null);

    // useState
    const [valueStatusCoupon, setValueStatusCoupon] = useState('');
    const [listCouponRender, setlistCouponRender] = useState([] as Array<ICoupon>);
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
        dispatch(changeCouponToNull());
        setIsModalOpen(false);
    };

    const handleOk = () => {
        if (inputSubmitRef.current !== null) {
            inputSubmitRef.current?.click();
        }
    };

    const changeCouponEditAndOpenModal = async (couponId: string) => {
        await dispatch(getCoupon(couponId));
        showModal();
    };

    const openNewForm = () => {
        dispatch(changeCouponToNull());
        showModal();
    };

    //Function RangPicker
    const handleChangeRangPicker = async(range: any) => {
        const valueOfInput1 = range[0].format();
        const valueOfInput2 = range[1].format();
        await dispatch(getCoupons({ search: valueSearch, status: valueStatusCoupon, startDate: formatDateFullYear(valueOfInput1), endDate: formatDateFullYear(valueOfInput2) }));
        handleFilterCoupons({ search: valueSearch, limit: numberItemPerPage.value, page: currentPage, status: valueStatusCoupon, startDate: formatDateFullYear(valueOfInput1), endDate: formatDateFullYear(valueOfInput2) });
        console.log('start date', valueOfInput1);
        console.log("end date", valueOfInput2);
    }

    // Function Pagination
    const onPageChange = async (newPage: number) => {
        setCurrentPage(newPage);
        handleFilterCoupons({ search: valueSearch, limit: numberItemPerPage.value, page: newPage, staus: valueStatusCoupon });
    };

    const onChangeNumberItemPerPage = async (newItem: INumberItemPerPage) => {
        setNumberItemPerPage({
            ...newItem
        });
        setCurrentPage(1);
        await dispatch(getCoupons({ search: valueSearch, status: valueStatusCoupon }));
        handleFilterCoupons({ search: valueSearch, limit: newItem.value, page: 1, status: valueStatusCoupon });
    };

    // Function Input
    const handleSeachProduct = async (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key == 'Enter') {
            await dispatch(getCoupons({ search: valueSearch, status: '' }));
            onPageChange(1);
        }
    };

    // Function Select
    const handleChange = async (value: string) => {
        setValueStatusCoupon(value);
        setCurrentPage(1);
        await dispatch(getCoupons({ search: valueSearch, status: value }));
        handleFilterCoupons({ search: valueSearch, limit: numberItemPerPage.value, page: 1, status: value });
    };

    const handleFilterCoupons = async ({ search, limit, page, status,startDate, endDate }: any) => {
        const dataProducts = await dispatch(filterCoupons({ search: search, limit: limit, page: page, status: status, startDate, endDate }));
        setlistCouponRender(dataProducts.payload);
    };

    // #endregion Funtion

    // useEffect
    useEffect(() => {
        dispatch(getCoupons({ search: '', status: '' }));
        handleFilterCoupons({ search: '', limit: numberItemPerPage.value, page: 1, status: valueStatusCoupon });
    }, []);

    useEffect(() => {
        if (success) {
            handleCloseModal();
            dispatch(getCoupons({ search: valueSearch, status: valueStatusCoupon }));
            handleFilterCoupons({ search: valueSearch, limit: numberItemPerPage.value, page: currentPage, status: valueStatusCoupon });
            if (successMessage) {
                openNotificationResetSuccess('success', successMessage);
            }
            dispatch(changeErrorToNull());
            dispatch(changeStatusSuccessToFalse());
            dispatch(changeCouponToNull());
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
                            <Button handleClick={openNewForm}>Thêm mới phiếu giảm giá</Button>
                        </div>
                    </div>
                    <div className="manage-food-toolbar">
                        <Select
                            defaultValue='expired'
                            value={valueStatusCoupon}
                            style={{ width: 120 }}
                            onChange={handleChange}
                            suffixIcon={<FilterOutlined style={{ fontSize: '15px', color: '#000' }} />}
                            options={[
                                { value: '', label:'Tất cả'},
                                { value: 'expired', label:'Đã hết hạn'},
                                { value: 'paused', label:'Tạm dừng'},
                                { value: 'unexpired', label:'Còn hạn'},
                            ]}
                        />
                        <RangePicker onChange={handleChangeRangPicker} className='range-date' style={{ margin: '0 10px' }} placeholder={["Ngày bắt đầu", "Ngày kết thúc"]} />
                        <div className="input-search-coupon" >
                            <div className='box-input'>
                                <SearchOutlined className='icon-input' />
                                <input value={valueSearch} onKeyPress={(e) => handleSeachProduct(e)} onChange={e => setValueSearch(e.target.value)} className="base-input" type="text" placeholder="Tìm kiếm theo mã"></input>
                            </div>
                        </div>
                    </div>
                    <div className="manage-food-table">
                        <TableCoupon changeCouponEditAndOpenModal={changeCouponEditAndOpenModal} listCoupon={listCouponRender} isLoading={loading}></TableCoupon>
                    </div>
                    <div className="manage-food-pagination">
                        <Pagination
                            handleChangeNumberItemPerPage={onChangeNumberItemPerPage}
                            currentPage={currentPage}
                            handleChangePage={onPageChange}
                            listDataTable={listCoupon}
                            numberItemPerPage={numberItemPerPage}
                            siblingCount={1}
                            optionsItemPerPage={optionsItemPerPage}
                        ></Pagination>
                    </div>
                    <Modal bodyStyle={{ maxHeight : '300px !important'}} className='modal-coupon' title={<div style={{ display: 'flex', alignItems: 'center' }}>
                        <span style={{ marginRight: '10px' }}>{coupon.couponId ? 'Sửa thông tin phiếu giảm giá' : 'Thêm phiếu giảm giá'}</span>
                    </div>} open={isModalOpen} onOk={handleOk} onCancel={handleCloseModal} okText='Lưu' cancelText='Hủy'>
                        <FormCoupon formRef={formRef} couponEdit={coupon} handleCloseModal={handleCloseModal} inputSubmitRef={inputSubmitRef} />
                    </Modal>
                </>
                :
                <div className='login-to-view-product'>Bạn chưa đăng nhập</div>
            }

        </div>
    );
};
export default ManageCoupon;