import './style.css'
import * as Yup from 'yup';
import { Formik } from "formik";
import { useAppDispatch } from 'store/hook';
import {  resetPassword } from '../AuthenSlice';
import { useSearchParams } from 'react-router-dom';

const ResetPassword = () =>{
    // store
    const dispatch = useAppDispatch();

    // useParams
    const [searchParams] = useSearchParams();
    const token = searchParams.get('token'); 

    // Function
    const handleChangePassword = (values: any) => {
        const {password} = values;
        if(password){
            dispatch(resetPassword({ password, token }))
        }
    }

    return(
        <Formik
            initialValues={{
                password: '',
            }}
            validationSchema={Yup.object({
                password: Yup.string().min(5, 'Mật khẩu yếu').max(20, 'Vui lòng nhập dưới 20 kí tự').required('Vui lòng nhập mật khẩu'),
            })}
            onSubmit={values => {
                handleChangePassword(values);
            }}>
            {formik => (
                <form className='form-reset-password' onSubmit={formik.handleSubmit}>
                    <div className='reset-password-modal'>
                        <div className="name-app-reset-password">
                            Đồ ăn việt
                        </div>
                        <div className="inputBox">
                            <input type="password" placeholder='Mật khẩu mới' {...formik.getFieldProps('password')} name='password' />
                            {formik.touched.password && formik.errors.password ? (
                                <div className="text-error">{formik.errors.password}</div>
                            ) : null}
                        </div>
                        <div className="inputBox">
                            <input type="submit" value='Thay đổi mật khẩu' id='btn' />
                        </div>
                    </div>
                </form>
            )}
        </Formik>
    )
}

export default ResetPassword