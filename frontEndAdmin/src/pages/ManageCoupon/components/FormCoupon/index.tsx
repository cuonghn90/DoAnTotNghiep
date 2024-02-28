import './style.css';
import * as Yup from 'yup';
import type { DatePickerProps } from 'antd';
import { DatePicker, Select, Space } from 'antd';
import dayjs from 'dayjs';
import { Formik } from "formik";
import { useEffect, useState } from 'react';
import { useAppDispatch, useAppSelector } from 'store/hook';
import { createCoupon, createCouponCode, updateCoupon } from 'pages/ManageCoupon/couponSlice';
import { ICoupon } from 'interface';
import Loading from 'components/Loading/Loading';
import { formatDateFullYear } from 'utils/uitls';

interface RecordType {
    key: string;
    title: string;
    description: string;
}

const mockData: RecordType[] = Array.from({ length: 20 }).map((_, i) => ({
    key: i.toString(),
    title: `content${i + 1}`,
    description: `description of content${i + 1}`,
}));

const initialTargetKeys = mockData.filter((item) => Number(item.key) > 10).map((item) => item.key);

interface IProps {
    inputSubmitRef: any,
    formRef: any,
    handleCloseModal: Function,
    couponEdit?: ICoupon,
}

const FormCoupon = ({ inputSubmitRef, formRef, couponEdit, handleCloseModal }: IProps) => {
    // store
    const dispatch = useAppDispatch();
    const { users } = useAppSelector(state => state.authStore);
    const { loading } = useAppSelector(state => state.productStore);
    // use State
    const [valueDateStart, setValueDateStart] = useState(dayjs(couponEdit?.startDateDiscount ? couponEdit?.startDateDiscount : formatDateFullYear(new Date()), 'YYYY-MM-DD'));
    const [valueDateEnd, setValueDateEnd] = useState(dayjs(couponEdit?.endDateDiscount ? couponEdit?.endDateDiscount : formatDateFullYear(new Date((new Date()).getTime() + 7 * 24 * 60 * 60 * 1000)), 'YYYY-MM-DD'));
    const [valueStatusCoupon, setValueStatusCoupon] = useState(couponEdit?.statusCoupon ? couponEdit?.statusCoupon : 'unexpired');
    const [selectTakeBy, setSelectTakeBy] = useState(couponEdit?.takeBy ? couponEdit.takeBy.split("+") : ['system']);
    const [optionsTakeBy, setOptionsTakeBy] = useState<any>([]);
    const [selectDiscountFor, setSelectDiscountFor] = useState([couponEdit?.discountFor ? couponEdit?.discountFor : 'order']);
    const [valueTypeCoupon, setValueTypeCoupon] = useState('ALL');
    const [valueCouponCode, setValueCouponCode] = useState(couponEdit?.couponId ? couponEdit.couponCode : '');
    // Function
    const handleChangeTypeCoupon = async (value: string) => {
        setValueTypeCoupon(value);
        const newCouponCode = await dispatch(createCouponCode(value));
        setValueCouponCode(newCouponCode.payload.couponCode);
        if (value == 'USER') {
            setSelectTakeBy([]);
        }
        else {
            setSelectTakeBy(['system']);
        }
    };


    const handleChangeSelectStatusCoupon = (value: string) => {
        setValueStatusCoupon(value);
    };
    const handleChangeSelectTakeBy = (value: string[]) => {
        setSelectTakeBy(value);
    };
    const handleChangeSelectDiscountFor = (value: string[]) => {
        setSelectDiscountFor(value);
    };

    const onChangeDateStart: DatePickerProps['onChange'] = (date, dateString) => {
        setValueDateStart(dayjs(dateString, 'YYYY-MM-DD'));
    };
    const onChangeDateEnd: DatePickerProps['onChange'] = (date, dateString) => {
        setValueDateEnd(dayjs(dateString, 'YYYY-MM-DD'));
    };

    const handleSubmitForm = async (values: any) => {
        let arrayTakeBy = 'system';
        if (valueTypeCoupon == 'USER'){
            arrayTakeBy = ''
            values.takeBy.map((item: any, index: number) => {
                arrayTakeBy += (index == 0 ? item.label : '+' + item.label);
            });
        }
       
        const coupon: ICoupon = {
            id: couponEdit?.id ? couponEdit?.id : 0,
            couponId: couponEdit?.couponId ? couponEdit?.couponId : '',
            statusCoupon: values?.statusCoupon ? values?.statusCoupon : 'unexpired',
            couponCode: valueCouponCode,
            discount: values.discount,
            startDateDiscount: values.startDateDiscount,
            endDateDiscount: values.endDateDiscount,
            takeBy: arrayTakeBy,
            discountFor: values.discountFor
        };

        const typeAction = couponEdit?.couponId ? 'EDIT' : 'ADD';
        switch (typeAction) {
            case 'ADD':
                await dispatch(createCoupon(coupon));
                break;
            case 'EDIT':
                await dispatch(updateCoupon(coupon));
                break;
            default:
                break;
        }
    };

    //useEffect
    useEffect(() => {
        async function getNewCouponCode () {
            const newCouponCode = await dispatch(createCouponCode("ALL"));
            setValueCouponCode(newCouponCode.payload.couponCode);
        }
        if (couponEdit?.couponId) {
            setSelectTakeBy(couponEdit.takeBy.split("+"));
            setSelectDiscountFor([couponEdit.discountFor]);
            setValueStatusCoupon(couponEdit.statusCoupon);
            setValueCouponCode(couponEdit.couponCode);
            setValueTypeCoupon(couponEdit.takeBy == 'system' ? 'ALL' : 'USER')
            setValueDateStart(dayjs(formatDateFullYear(couponEdit.startDateDiscount), 'YYYY-MM-DD'));
            setValueDateEnd(dayjs(formatDateFullYear(couponEdit.endDateDiscount), 'YYYY-MM-DD'));
        }
        else {
            setValueDateStart(dayjs(formatDateFullYear(new Date()), 'YYYY-MM-DD'));
            setValueDateEnd(dayjs(formatDateFullYear(new Date((new Date()).getTime() + 7 * 24 * 60 * 60 * 1000)), 'YYYY-MM-DD'));
            setSelectTakeBy(['system']);
            setValueTypeCoupon('ALL')
            getNewCouponCode()
        }
    }, [couponEdit]);


    useEffect(() => {
        if (users && users.length > 0) {
            let options: any[] = [];
            users.map(user => {
                options.push({ value: user.userId, label: user.username });
            });
            setOptionsTakeBy(options);
        }
    }, [users]);

    return (
        <Formik
            innerRef={formRef}
            initialValues={{
                discount: (couponEdit?.couponId && couponEdit.couponId) ? couponEdit.discount : '',
                startDateDiscount: (couponEdit?.couponId && couponEdit.startDateDiscount) ? couponEdit.startDateDiscount : formatDateFullYear(new Date()),
                endDateDiscount: (couponEdit?.couponId && couponEdit.endDateDiscount) ? couponEdit.endDateDiscount : formatDateFullYear(new Date((new Date()).getTime() + 7 * 24 * 60 * 60 * 1000)),
                statusCoupon: (couponEdit?.couponId && couponEdit.statusCoupon) ? couponEdit.statusCoupon : 'unexpired',
                takeBy: (couponEdit?.couponId && couponEdit.takeBy) ? [couponEdit.takeBy.split("+")] : ['system'],
                discountFor: (couponEdit?.couponId && couponEdit.discountFor) ? couponEdit.discountFor : 'order',
            }}
            enableReinitialize
            validationSchema={Yup.object({
                discount: Yup.number().moreThan(0, "Gía trị phải lớn hơn 0").lessThan(100, "Giá trị phải nhỏ hơn 100").typeError('giá trị phải là số').required("Vui lòng nhập phần trăm giảm giá"),
                startDateDiscount: Yup.string().required('Vui lòng chọn ngày bắt đầu giảm giá'),
                endDateDiscount: Yup.string().required('Vui lòng chọn ngày kết thúc giảm giá'),
                takeBy: Yup.array().required("Vui lòng chọn người nhận phiếu giảm giá"),
                discountFor: Yup.string().required("Vui lòng chọn ảnh hưởng của phiếu giảm giá")
            })}

            onSubmit={async (values, { resetForm }) => {
                handleSubmitForm(values);
            }}
        >
            {(formik) => (
                <form className='form-login' onSubmit={formik.handleSubmit}>
                    <div className='form-add-or-edit-coupon'>
                        <div className="row">
                            <div className="col ">
                                <div className="food-name">
                                    <label className='label-input'>Mã giảm giá</label>
                                    <div className="col-coupon-code">
                                        <div className="select-type-coupon">
                                            <Select
                                                disabled={couponEdit?.couponId ? true : false}
                                                defaultValue="ALL"
                                                value={valueTypeCoupon}
                                                style={{ width: '100%' }}
                                                onChange={handleChangeTypeCoupon}
                                                options={[
                                                    { value: 'ALL', label: 'Tất cả người dùng' },
                                                    { value: 'USER', label: 'Người dùng cụ thể' }
                                                ]}
                                            />
                                        </div>
                                        <input type="text" placeholder='Mã giảm giá' className='base-input' value={valueCouponCode} disabled style={{ color: 'grey' }} />
                                    </div>
                                </div>
                            </div>
                            <div className="col">
                                <div className="food-price">
                                    <label className='label-input'>Phần trăm giảm giá</label>
                                    <input className='base-input' type="text" placeholder='Phần trăm giảm giá' {...formik.getFieldProps('discount')} name='discount' />
                                    {formik.touched.discount && formik.errors.discount ? (
                                        <div className="text-error">{formik.errors.discount}</div>
                                    ) : <div className="text-error"></div>}
                                </div>
                            </div>
                        </div>
                        <div className="row">
                            <div className="col">
                                <div className="food-brand" style={{ display: 'flex', flexDirection: 'column' }}>
                                    <label className='label-input'>Ngày có hiệu lực</label>
                                    <DatePicker placeholder='Ngày có hiệu lực' value={valueDateStart} defaultValue={dayjs('2015-01-01', 'YYYY-MM-DD')} onChange={(date, dateString) => {
                                        onChangeDateStart(date, dateString);
                                        formik.setFieldValue('startDateDiscount', dateString);
                                    }} className='date-picker-custom' name='startDateDiscount' />
                                    {formik.touched.startDateDiscount && formik.errors.startDateDiscount ? (
                                        <div className="text-error">{(formik.errors.startDateDiscount).toString()}</div>
                                    ) : <div className="text-error"></div>}
                                </div>
                            </div>
                            <div className="col">
                                <div className='quantity-box' style={{ display: 'flex', flexDirection: 'column' }}>
                                    <label className='label-input'>Ngày hết hiệu lực</label>
                                    <DatePicker placeholder='Ngày hết hiệu lực' value={valueDateEnd} defaultValue={dayjs('2015-01-01', 'YYYY-MM-DD')} onChange={(date, dateString) => {
                                        onChangeDateEnd(date, dateString);
                                        formik.setFieldValue('endDateDiscount', dateString);
                                    }} className='date-picker-custom' name='endDateDiscount' />
                                    {/* <input className='base-input' type="text" placeholder='Quantity' {...formik.getFieldProps('endDateDiscount')} name='endDateDiscount' /> */}
                                    {formik.touched.endDateDiscount && formik.errors.endDateDiscount ? (
                                        <div className="text-error">{formik.errors.endDateDiscount}</div>
                                    ) : <div className="text-error"></div>}
                                </div>
                            </div>
                        </div>
                        <div className="row">
                            <div className="col">
                                <div style={{ display: 'flex', flexDirection: 'column', width: '100%' }}>
                                    <label className='label-input'>Trạng thái mã giảm giá</label>
                                    <Select
                                        defaultValue={valueStatusCoupon}
                                        style={{ width: '100%' }}
                                        onChange={(value) => {
                                            handleChangeSelectStatusCoupon(value);
                                            formik.setFieldValue('statusCoupon', value);
                                        }}
                                        value={valueStatusCoupon}
                                        options={[
                                            { value: 'expired', label: 'Đã hết hạn' },
                                            { value: 'paused', label: 'Tạm dừng' },
                                            { value: 'unexpired', label: 'Chưa hết hạn' },
                                        ]}
                                    />
                                </div>
                            </div>

                        </div>
                        <div className="row">
                            <div className="food-tags">
                                <label className='label-input'>Giảm giá cho những loại</label>
                                <Select
                                    mode="multiple"
                                    allowClear
                                    value={selectDiscountFor}
                                    style={{ width: '100%' }}
                                    placeholder="Chọn giá trị"
                                    defaultValue={selectDiscountFor}
                                    onChange={(value) => {
                                        handleChangeSelectDiscountFor(value);
                                        formik.setFieldValue('discountFor', value[0]);
                                    }}
                                    options={[
                                        { value: 'order', label: 'Giỏ hàng' },
                                        { value: 'product', label: 'Sản phẩm', disabled: true },
                                    ]}
                                />
                                {/* <input className='base-input' placeholder='Giảm giá cho những loại' {...formik.getFieldProps('discountFor')} name='discountFor' /> */}
                                {formik.touched.discountFor && formik.errors.discountFor ? (
                                    <div className="text-error">{formik.errors.discountFor}</div>
                                ) : <div className="text-error"></div>}
                            </div>
                        </div>
                        <div className="row">
                            <div className="food-describle">
                                <label className='label-textarea'>Người được nhận giảm giá</label>
                                <Select
                                    labelInValue
                                    disabled={(couponEdit?.couponId || valueTypeCoupon == 'ALL') ? true : false}
                                    mode="multiple"
                                    value={selectTakeBy}
                                    allowClear
                                    style={{ width: '100%' }}
                                    placeholder="Chọn giá trị"
                                    onChange={(value) => {
                                        handleChangeSelectTakeBy(value);

                                        formik.setFieldValue('takeBy', value);
                                    }}
                                    options={[
                                        { value: 'system', label: 'Tất cả người dùng', disabled: (valueTypeCoupon == 'USER' ? true : false) },
                                        ...optionsTakeBy
                                    ]}
                                />
                                {formik.touched.takeBy && formik.errors.takeBy ? (
                                    <div className="text-error">{formik.errors.takeBy}</div>
                                ) : <div className="text-error"></div>}
                            </div>
                        </div>
                    </div>
                    <input type="submit" hidden value='Save' id='btn' name='btnSaveProduct' ref={inputSubmitRef} />
                    {
                        loading ? <Loading></Loading> : ''
                    }
                </form>

            )}
        </Formik>
    );
};
export default FormCoupon;