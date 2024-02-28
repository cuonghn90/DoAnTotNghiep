import './style.css';
import * as Yup from 'yup';
import { Formik, FormikProps } from "formik";
import { useEffect, useRef, useState } from 'react';
import userBg from 'assets/images/user.png';
import { useAppDispatch, useAppSelector } from 'store/hook';
import { EditOutlined, CloseOutlined } from '@ant-design/icons';
import { setStateError, updateInfoUser } from 'pages/Authentication/AuthenSlice';
import Loading from 'components/Loading/Loading';
import { uploadOneImage } from 'pages/ManageFood/productSlice';

const ProfileSetting = () => {
    // store
    const { userInfo } = useAppSelector(state => state.authStore);
    const dispatch = useAppDispatch();

    // useRef 
    const formRef = useRef<FormikProps<any>>(null);

    // useState
    const [selectedImage, setSelectedImage] = useState(userInfo.avatar);
    const [fileImage, setFileImage] = useState({} as any);
    const [isEditProfile, setEditProfile] = useState(false);
    const [isLoadingUploadImage, setIsLoadingUploadImage] = useState(false);

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

    const handleUpdateProfile = async (values: any) => {
        const userUpdate = {
            firstname: values.firstname,
            lastname: values.lastname,
            phone: values.phone,
            address: values.address,
            dateOfBirth: values.dateOfBirth,
            avatar: userInfo.avatar
        };
        let linkImage;

        if (fileImage.name) {
            const imageConvert = await convertBase64(fileImage);
            setIsLoadingUploadImage(true);
            linkImage = await dispatch(uploadOneImage(imageConvert));
            setIsLoadingUploadImage(false);
            userUpdate.avatar = linkImage.payload;
        }

        await dispatch(updateInfoUser(userUpdate));
        setFileImage({} as any);
        if (linkImage?.payload) {
            setSelectedImage(linkImage?.payload);
        }
        if (formRef.current) {
            formRef.current.resetForm();
        }
        setEditProfile(false);
    };

    const closeEditAndResetForm = () => {
        if (formRef.current) {
            formRef.current.resetForm();
        }
        setEditProfile(false);
    };

    useEffect(()=>{
        if(userInfo.avatar){
            setSelectedImage(userInfo.avatar)
        }
    },[userInfo.userId])

    return (
        <Formik
            enableReinitialize
            innerRef={formRef}
            initialValues={{
                firstname: userInfo.firstname ? userInfo.firstname : '',
                lastname: userInfo.lastname ? userInfo.lastname : '',
                phone: userInfo.phone ? userInfo.phone : '',
                dateOfBirth: userInfo.dateOfBirth ? userInfo.dateOfBirth : '',
                address: userInfo.address ? userInfo.address : ''
            }}
            validationSchema={Yup.object({
                firstname: Yup.string(),
                lastname: Yup.string(),
                phone: Yup.string(),
                dateOfBirth: Yup.string(),
                address: Yup.string()
            })}
            onSubmit={async (values, { resetForm }) => {
                if (values.address != '' || values.dateOfBirth != '' || values.firstname != '' || values.lastname != '' || values.phone != '') {
                    await handleUpdateProfile(values);
                    resetForm();
                }
                else {
                    dispatch(setStateError({ message: 'Vui lòng nhập thông tin trước' }));
                }
            }}
        >
            {formik => (
                <form onSubmit={formik.handleSubmit} className='form-profile-setting'>
                    <div className='profile-setting'>
                        <div className='profile-setting-header'>
                            <div className='text-profile'>Thông tin cá nhân</div>
                            {
                                isEditProfile ? <CloseOutlined className='icon-edit-profile' onClick={() => closeEditAndResetForm()} /> : <EditOutlined onClick={() => setEditProfile(true)} className='icon-edit-profile' />
                            }
                        </div>
                        <div className="box-image">
                            <div className="wrap-image">
                                <img src={selectedImage ? selectedImage : userBg} alt="" className="image" />
                            </div>
                            <div className="btns-image">
                                <div className="btn-upload-image-profile btn-change-image">
                                    <label className={'button-primary' + (isEditProfile ? '' : ' disable')} htmlFor="image-profile">Thay ảnh</label>
                                    {
                                        isEditProfile ? <input id="image-profile" type="file" name="photo"
                                            style={{ display: 'none' }}
                                            onChange={(event) => uploadImage(event)}
                                        />
                                            :
                                            <></>
                                    }
                                </div>
                            </div>
                        </div>
                        <div className='form-profile'>
                            <div className="row">
                                <div className="field-profile">
                                    <div className="field-label">Họ</div>
                                    <input type="text" className="field-input " disabled={!isEditProfile} {...formik.getFieldProps('firstname')} name="firstname" />
                                </div>
                                <div className="field-profile">
                                    <div className="field-label">Tên</div>
                                    <input type="text" className="field-input" disabled={!isEditProfile} {...formik.getFieldProps('lastname')} name="lastname" />
                                </div>
                            </div>
                            <div className="row">
                                <div className="field-profile">
                                    <div className="field-label">Số điện thoại</div>
                                    <input type="text" className="field-input" disabled={!isEditProfile} {...formik.getFieldProps('phone')} name="phone" />
                                </div>
                                <div className="field-profile">
                                    <div className="field-label">Ngày sinh</div>
                                    <input type="text" className="field-input" disabled={!isEditProfile} {...formik.getFieldProps('dateOfBirth')} name="dateOfBirth" />
                                </div>
                            </div>
                            <div className="row">
                                <div className="field-profile">
                                    <div className="field-label">Địa chỉ</div>
                                    <input type="text" className="field-input" disabled={!isEditProfile} {...formik.getFieldProps('address')} name="address" />
                                </div>
                            </div>
                        </div>
                        <div className="btn-save-profile">
                            <input type="submit" value='Lưu' id='btn-save-profile' name='btnSaveProfile' className={'button-primary' + (isEditProfile ? '' : ' disable')} />
                        </div>
                    </div>
                    {isLoadingUploadImage ? <Loading></Loading> : ''}
                </form>
            )}
        </Formik>
    );
};
export default ProfileSetting;