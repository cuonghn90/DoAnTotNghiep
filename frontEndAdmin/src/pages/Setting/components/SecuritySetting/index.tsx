import * as Yup from 'yup';
import { Formik } from "formik";
import './style.css';
import { useAppDispatch } from 'store/hook';
import { updatePasswordDb } from 'pages/Authentication/AuthenSlice';
const SecuritySetting = () => {
    // store
    const dispatch= useAppDispatch()
   
    //  Function
    const handleChangePassword = async (values: any) => {
        await dispatch(updatePasswordDb(values))
    }
    
    return (
        <Formik
            initialValues={{
                password: '',
                newPassword: ''
            }}
            validationSchema={Yup.object({
                password: Yup.string().min(5, 'Mật khẩu yếu').max(20, 'Vui lòng nhập dưới 20 kí tự').required('Vui lòng nhập mật khẩu'),
                newPassword: Yup.string().min(5, 'Mật khẩu yếu').max(20, 'Vui lòng nhập dưới 20 kí tự').required('Vui lòng nhập mật khẩu'),
            })}
            onSubmit={async(values,{resetForm}) => {
                await handleChangePassword(values);
                resetForm();
            }}>
            {formik => (
                <form className='form-change-password' onSubmit={formik.handleSubmit}>
                    <div className='security-setting'>
                        <div className='title-security'>Bảo mật</div>
                        <div className='security-option'>
                            <div className="title-option">Đổi mật khẩu</div>
                            <div className="form-change-password">
                                <div className="field-profile">
                                    <div className="field-label">Mật khẩu hiện tại</div>
                                    <input type="password" className="field-input" {...formik.getFieldProps('password')} name="password" />
                                    {formik.touched.password && formik.errors.password ? (
                                        <div className="text-error">{formik.errors.password}</div>
                                    ) : null}
                                </div>
                                <div className="field-profile">
                                    <div className="field-label">Mật khẩu mới</div>
                                    <input type="password" className="field-input" {...formik.getFieldProps('newPassword')} name="newPassword" />
                                    {formik.touched.newPassword && formik.errors.newPassword ? (
                                        <div className="text-error">{formik.errors.newPassword}</div>
                                    ) : null}
                                </div>
                                <div className='btn-save-password'>
                                    <input type="submit" value='Lưu' className='button-primary' />
                                </div>
                            </div>
                        </div>
                    </div>
                </form>
            )}
        </Formik>
    );
};
export default SecuritySetting;