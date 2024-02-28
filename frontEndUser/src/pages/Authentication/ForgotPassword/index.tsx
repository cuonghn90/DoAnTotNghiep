import './style.css';
import * as Yup from 'yup';
import { Formik } from "formik";
import { emailRegExp } from 'constant/constant';
import { useAppDispatch } from 'store/hook';
import { forgotPassword } from '../AuthenSlice';

const ForgotPassword = () => {
    // store
    const dispatch = useAppDispatch();

    // Function 
    const handleForgotPassword = (values: any) => {
        const { email } = values;
        if (email) {
            dispatch(forgotPassword({ email }));
        }
    };

    return (
        <Formik
            initialValues={{
                email: '',
            }}
            validationSchema={Yup.object({
                email: Yup.string().matches(emailRegExp, 'Email không đúng định dạng').required("Vui lòng nhập email"),
            })}
            onSubmit={values => {
                handleForgotPassword(values);
            }}>
            {formik => (
                <form className='form-forgot-password' onSubmit={formik.handleSubmit}>
                    <div className='forgot-password-modal'>
                        <div className="name-app-forgot-password">
                            Đồ ăn việt
                        </div>
                        <div className="inputBox">
                            <input type="text" placeholder='Nhập email để đặt lại mật khẩu' {...formik.getFieldProps('email')} name='email' />
                            {formik.touched.email && formik.errors.email ? (
                                <div className="text-error">{formik.errors.email}</div>
                            ) : null}
                        </div>
                        <div className="inputBox">
                            <input type="submit" value='Xác nhận' id='btn' />
                        </div>
                    </div>
                </form>
            )}
        </Formik>
    );
};
export default ForgotPassword;