import { Popconfirm, notification } from 'antd';
import './style.css';
import { EditFilled, DeleteFilled } from '@ant-design/icons';
import * as Yup from 'yup';
import { Formik } from "formik";
import { useAppDispatch, useAppSelector } from 'store/hook';
import { useEffect, useState } from 'react';
import { changeCategoryToNull, changeErrorToNull, changeStatusSuccessToFalse, createCategory, deleteCategory, getCategory, getCategorys, getCategorysAndProduct, updateCategory } from './categorySlice';


type NotificationType = 'success' | 'info' | 'warning' | 'error';

const Category = () => {
    // store
    const dispatch = useAppDispatch()
    const {categorys, category, success, successMessage, error} = useAppSelector(state => state.categoryStore)

    // useState
    const [valueInputCategory, setValueInputCategory] = useState('')

    // state & Function antd
    const [api, contextHolderNoti] = notification.useNotification();
    const confirm = async (categoryId: string) => {
        await dispatch(deleteCategory({categoryId}));
    };
    const cancel = () => {
    };
    const openNotificationResetSuccess = (type: NotificationType, successMessage: string) => {
        api[type]({
            message: 'Thông báo',
            description: successMessage,
        });
    };
    
    // Function
    const handleFindCategoryEdit = async(categoryId: string)=>{
        await dispatch(getCategory({categoryId}))
    }

    const handleSubmitForm = async(values: any) => {
        const nameCategory = values.name
        if (category.categoryId){
            await dispatch(updateCategory({ name: nameCategory, categoryId: category.categoryId }))
        }else{
            await dispatch(createCategory({ name: nameCategory }))
        }
        setValueInputCategory('')
    }

    const handleCancleSaveCatgeory = (event: React.MouseEvent<HTMLElement>) => {
        event.preventDefault()
        dispatch(changeCategoryToNull());
        setValueInputCategory('')
    }

    // use Effect
    useEffect(()=>{
        dispatch(getCategorysAndProduct())
    },[])

    useEffect(()=>{
        if(category.categoryId){
            setValueInputCategory(category.name)
        }
    }, [category])

    useEffect(()=>{
        if (success) {
            dispatch(getCategorysAndProduct());
            if (successMessage) {
                openNotificationResetSuccess('success', successMessage);
            }
            dispatch(changeErrorToNull());
            dispatch(changeStatusSuccessToFalse());
            dispatch(changeCategoryToNull());
        }
        if (error != null) {
            openNotificationResetSuccess('error', error.message);
            dispatch(changeErrorToNull());
        }
    },[success, error])

    return (
        <Formik
            initialValues={{ name: category.categoryId ? category.name : ''}}
            enableReinitialize
            validationSchema={Yup.object({
                name: Yup.string().required("Vui lòng nhập tiêu đề danh mục")
            })}
            onSubmit={async (values, { resetForm }) => {
                await handleSubmitForm(values);
                resetForm()
            }}
        >
            {(formik) => (
                <form className='form-category' onSubmit={formik.handleSubmit} name='formCategory'>
                    {contextHolderNoti}
                    <div className="manage-categorys">
                        <div className='categorys-left'>
                            <div className='category-title category-title-left'>Danh mục hiện có </div>
                            <div className="category-content category-content-left">
                                <div className="category-table" id='tableCategory'>
                                    <div className="category-table-first-row">
                                        <div className="first-col-category category-id">Mã danh mục</div>
                                        <div className="first-col-category category-name">Tên danh mục</div>
                                        <div className="first-col-category category-product">Sản phẩm</div>
                                        <div className="first-col-category category-action">Chức năng</div>
                                    </div>
                                    <div className="category-table-content">
                                        {
                                            categorys.length > 0 ? categorys.map(categoryItem => {
                                                return(
                                                    <div className='category-item' key={categoryItem.categoryId}>
                                                        <div className="col-category category-id">{categoryItem.categoryId}</div>
                                                        <div className="col-category category-name">{categoryItem.name}</div>
                                                        <div className="col-category category-product">{categoryItem?.products?.length}</div>
                                                        <div className="col-category category-action">
                                                            <span className="wrap-btn-action" onClick={() => handleFindCategoryEdit(categoryItem.categoryId)}>
                                                                <EditFilled className='icon-action' />
                                                            </span>
                                                            <Popconfirm
                                                                title="Xóa danh mục"
                                                                description="Bạn có chắc chắn muốn xóa danh mục này?"
                                                                onConfirm={() => confirm(categoryItem.categoryId)}
                                                                onCancel={cancel}
                                                                okText="Có"
                                                                cancelText="Không"
                                                            >
                                                                <span className="wrap-btn-action">
                                                                    <DeleteFilled className='icon-action' />
                                                                </span>
                                                            </Popconfirm>
                                                        </div>
                                                    </div>
                                                )
                                            })
                                            :
                                            ''
                                        }
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className='categorys-right'>
                            <div className='category-title category-title-right'>{category.categoryId ? "Sửa danh mục" :  "Thêm mới danh mục"}</div>
                            <div className="category-content category-content-right">
                                <div className="category-name-input">
                                    <label className='label-input'>Tên danh mục</label>
                                    <input type="text" placeholder='Nhập tên danh mục' className='base-input' value={valueInputCategory} onChange={e => {
                                        setValueInputCategory(e.target.value)
                                        formik.setFieldValue('name',e.target.value)
                                    }}  
                                    name='name' />
                                    {formik.touched.name && formik.errors.name ? (
                                        <div className="text-error">{formik.errors.name}</div>
                                    ) : null}
                                </div>
                            </div>
                            <div className="category-form-btn-submit">
                                <button value='Hủy' style={{ marginRight: '10px' }} name='btnCancleFormCategory' className={'button-primary ' + (valueInputCategory != '' ? '' : 'disable')} onClick={handleCancleSaveCatgeory}>Hủy</button>
                                <button type="submit" value='Lưu' className='button-primary' name='btnSaveCategory'>{category.categoryId ? "Sửa" : "Thêm"}</button>
                            </div>
                        </div>
                    </div>
                </form>

            )}
        </Formik >
    );
};

export default Category;