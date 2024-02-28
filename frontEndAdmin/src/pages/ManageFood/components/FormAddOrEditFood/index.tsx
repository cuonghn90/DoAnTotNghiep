import './style.css';
import * as Yup from 'yup';
import { Select } from 'antd';
import { Formik } from "formik";
import { useEffect, useState } from 'react';
import { useAppDispatch, useAppSelector } from 'store/hook';
import { createProduct, updateProduct, uploadOneImage } from 'pages/ManageFood/productSlice';
import { IProduct } from 'interface';
import Loading from 'components/Loading/Loading';

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
    productEdit?: IProduct,
}

const FormAddOrEditFood = ({  inputSubmitRef, formRef, productEdit, handleCloseModal }: IProps) => {
    // store
    const dispatch = useAppDispatch();
    const { arrayOptionCategory } = useAppSelector(state => state.categoryStore);
    // use State
    const [optionCategoryToCreate, setOptionCategoryToCreate] = useState<Array<any> | undefined>([]);
    const [selectedImage, setSelectedImage] = useState(productEdit?.image);
    const { loading } = useAppSelector(state => state.productStore);
    const [fileImage, setFileImage] = useState({} as any);

    // Function
    const convertBase64 = (file: any) => {
        return new Promise((resolve, reject) => {
            const fileReader = new FileReader();
            fileReader.readAsDataURL(file);

            fileReader.onload = () => {
                resolve(fileReader.result);
            };

            fileReader.onerror = (error) => {
                reject(error);
            };
        });
    };

    const uploadImage = async (event: React.ChangeEvent<HTMLInputElement>) => {
        let filesRaw: any = event.currentTarget as EventTarget;
        const files = filesRaw.files;
        if (files.length > 0) {
            setFileImage(files[0]);
            setSelectedImage(URL.createObjectURL(files[0]));
        }
    };

    const handleSubmitForm = async (values: any) => {
        const product: IProduct = {
            productId: productEdit?.productId ? productEdit.productId : '',
            name: values.name,
            slug: values.slug,
            description: values.description,
            price: values.price,
            image: values.image,
            brand: values.brand,
            quantity: values.quantity,
            sold: values.sold,
            tags: values.tags,
            totalRating: values.totalRating,
            categoryId: values.categoryId
        };

        const typeAction = productEdit?.productId ? 'EDIT' : 'ADD';
        switch (typeAction) {
            case 'ADD':
                await dispatch(createProduct(product));
                break;
            case 'EDIT':
                await dispatch(updateProduct(product));
                break;
            default:
                break;
        }
        setFileImage({} as any);
    };

    // useEffect
    useEffect(() => {
        setSelectedImage(productEdit?.image);
    }, [productEdit]);
    useEffect(() => {
        if (arrayOptionCategory.length > 0) {
            const newListOption = [];
            for (let i = 0; i < arrayOptionCategory.length; i++) {
                newListOption.push(arrayOptionCategory[i]);
            }
            setOptionCategoryToCreate(newListOption);
        }
    }, []);
    return (
        <Formik
            innerRef={formRef}
            initialValues={{
                name: (productEdit?.productId && productEdit.name) ? productEdit.name : '',
                slug: (productEdit?.productId && productEdit.slug) ? productEdit.slug : '',
                description: (productEdit?.productId && productEdit.description) ? productEdit.description : '',
                price: (productEdit?.productId && productEdit.price) ? productEdit.price : 0,
                image: (productEdit?.productId && productEdit.image) ? productEdit.image : '',
                categoryId: (productEdit?.productId && productEdit.categoryId) ? productEdit.categoryId : arrayOptionCategory[0].value,
                brand: (productEdit?.productId && productEdit.brand) ? productEdit.brand : '',
                quantity: (productEdit?.productId && productEdit.quantity) ? productEdit.quantity : 0,
                sold: (productEdit?.productId && productEdit.sold) ? productEdit.sold : 0,
                tags: (productEdit?.productId && productEdit.tags) ? productEdit.tags : '',
                totalRating: (productEdit?.productId && productEdit.totalRating) ? productEdit.totalRating : 0
            }}
            enableReinitialize
            validationSchema={Yup.object({
                name: Yup.string().required("Vui lòng nhập tên"),
                slug: Yup.string(),
                description: Yup.string().required("Vui lòng nhập mô tả cho sản phẩm"),
                price: Yup.number().moreThan(0, "Gía phải lớn hơn 0").typeError('Must be a number').required("Vui lòng nhập giá"),
                image: Yup.string().required('Vui lòng chọn ảnh'),
                categoryId: Yup.string(),
                brand: Yup.string().required("Vui lòng nhập nhãn hiệu"),
                quantity: Yup.number().moreThan(0, "Số lượng phải lớn hơn 0").typeError('Must be a number').required("Vui lòng nhập số lượng"),
                sold: Yup.number(),
                tags: Yup.string().required("Vui lòng nhập từ khóa"),
                totalRating: Yup.number()
            })}

            onSubmit={async (values, { resetForm }) => {
                if(fileImage.name){
                    const imageConvert = await convertBase64(fileImage);
                    const linkImage = await dispatch(uploadOneImage(imageConvert));
                    values.image = linkImage.payload;
                }
                handleSubmitForm(values);
            }}
        >
            {(formik) => (
                <form className='form-login' onSubmit={formik.handleSubmit}>
                    <div className='form-add-or-edit'>
                        <div className="row-column">
                            <div className="food-image">
                                <div className="wrap-food-image">
                                    <img src={selectedImage ? selectedImage : ''} alt="" className="image-of-food" />
                                </div>
                            </div>
                            <div className="btn-upload-image-food">
                                <label className='btn-upload button-primary' htmlFor="image-food">Tải ảnh lên</label>
                                <input id="image-food" type="file" name="image"
                                    style={{ display: 'none' }}
                                    onChange={(event) => {
                                        let files: any = event.currentTarget as EventTarget;
                                        formik.setFieldValue('image', URL.createObjectURL(files.files[0]));
                                        uploadImage(event);
                                    }}
                                />
                                {formik.touched.image && formik.errors.image ? (
                                    <div className="text-error">{formik.errors.image}</div>
                                ) : null}
                            </div>
                        </div>
                        <div className="row">
                            <div className="col">
                                <div className="food-name">
                                    <label className='label-input'>Tên sản phẩm</label>
                                    <input type="text" placeholder='Food name' className='base-input' {...formik.getFieldProps('name')} name='name' />
                                    {formik.touched.name && formik.errors.name ? (
                                        <div className="text-error">{formik.errors.name}</div>
                                    ) : null}
                                </div>
                            </div>
                            <div className="col">
                                <div className="food-price">
                                    <label className='label-input'>Gía sản phẩm</label>
                                    <input className='base-input' type="text" placeholder='Price' {...formik.getFieldProps('price')} name='price' />
                                    {formik.touched.price && formik.errors.price ? (
                                        <div className="text-error">{formik.errors.price}</div>
                                    ) : <div className="text-error"></div>}
                                </div>
                            </div>
                        </div>
                        <div className="row">
                            <div className="col">
                                <div className="food-brand">
                                    <label className='label-input'>Nhãn hiệu</label>
                                    <input className='base-input' type="text" placeholder='Brand' {...formik.getFieldProps('brand')} name='brand' />
                                    {formik.touched.brand && formik.errors.brand ? (
                                        <div className="text-error">{formik.errors.brand}</div>
                                    ) : <div className="text-error"></div>}
                                </div>
                            </div>
                            <div className="col">
                                <div className="food-region">
                                    <label>Danh mục sản phẩm</label>
                                    <Select
                                        defaultValue={arrayOptionCategory[0].value}
                                        value={formik.getFieldProps('categoryId')}
                                        style={{ width: 120 }}
                                        onChange={(value) => formik.setFieldValue('categoryId', value)}
                                        options={optionCategoryToCreate}
                                    />
                                </div>
                                <div className='quantity-box'>
                                    <label className='label-input'>Số lượng</label>
                                    <input className='base-input' type="text" placeholder='Quantity' {...formik.getFieldProps('quantity')} name='quantity' />
                                    {formik.touched.quantity && formik.errors.quantity ? (
                                        <div className="text-error">{formik.errors.quantity}</div>
                                    ) : <div className="text-error"></div>}
                                </div>
                            </div>
                        </div>
                        <div className="row">
                            <div className="food-tags">
                                <label className='label-input'>Liên quan</label>
                                <input className='base-input' placeholder='Tags' {...formik.getFieldProps('tags')} name='tags' />
                                {formik.touched.tags && formik.errors.tags ? (
                                    <div className="text-error">{formik.errors.tags}</div>
                                ) : <div className="text-error"></div>}
                            </div>
                        </div>
                        <div className="row">
                            <div className="food-describle">
                                <label className='label-textarea'>Mô tả</label>
                                <textarea rows={5} className='base-textarea' placeholder='Description' {...formik.getFieldProps('description')} name='description' >
                                </textarea>
                                {formik.touched.description && formik.errors.description ? (
                                    <div className="text-error">{formik.errors.description}</div>
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
export default FormAddOrEditFood;