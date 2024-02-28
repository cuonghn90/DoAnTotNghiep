
import './style.css';
import { useNavigate } from 'react-router-dom';
import * as Yup from 'yup';
import { Formik } from "formik";
import { IUserRegister } from 'interface';
import { useAppDispatch } from 'store/hook';
import { setStateError, userRegister } from "../AuthenSlice";
import { phoneRegExp } from 'constant/constant';
interface IFormSignUp {
    email: string,
    phone: string;
    password: string,
    confirmPassword: string;
}
const Register = () => {
    // store
    const dispatch = useAppDispatch();

    // useNavigate
    const navigate = useNavigate();
    const redictToLogin = () => {
        navigate('/auth/login');
    };

    // Function
    const handleValueSignUp = async (values: IFormSignUp) => {
        const userModel: IUserRegister = {
            email: values.email,
            password: values.password,
            phone: values.phone
        };
        await dispatch(userRegister(userModel));

    };

    return (
        <Formik
            enableReinitialize
            initialValues={{ email: '', password: '', phone: '', confirmPassword: '' }}
            validationSchema={Yup.object({
                email: Yup.string().email('Email không đúng định dạng').required("Vui lòng nhập email"),
                password: Yup.string().min(5, 'Mật khẩu yếu').max(20, 'Vui lòng nhập dưới 20 kí tự').required('Vui lòng nhập mật khẩu'),
                phone: Yup.string().matches(phoneRegExp, 'Số điện thoại không hợp lệ').required('Vui lòng nhập số điện thoại'),
                confirmPassword: Yup.string().min(5, 'Mật khẩu yếu').max(20, 'Vui lòng nhập dưới 20 kí tự').required('Vui lòng nhập lại mật khẩu'),
            })}
            onSubmit={async (values, { resetForm }) => {
                if (values.password !== values.confirmPassword) {
                    dispatch(setStateError({ message: 'Mật khẩu  không  khớp, vui lòng nhập lại' }));
                }
                else{
                    await handleValueSignUp(values);
                    resetForm();
                }
            }}
        >
            {formik => (
                <form onSubmit={formik.handleSubmit} className='signup-form'>
                    <div >
                        <h2>Đồ ăn Việt</h2>
                        <div className="inputBox">
                            <input type="text" placeholder='Email' {...formik.getFieldProps('email')} name="email" />
                            {formik.touched.email && formik.errors.email ? (
                                <div className="text-error">{formik.errors.email}</div>
                            ) : null}
                        </div>
                        <div className="inputBox">
                            <input type="text" placeholder='Số điện thoại' {...formik.getFieldProps('phone')} name="phone" />
                            {formik.touched.phone && formik.errors.phone ? (
                                <div className="text-error">{formik.errors.phone}</div>
                            ) : null}
                        </div>
                        <div className="inputBox">
                            <input type="password" placeholder='Mật khẩu' {...formik.getFieldProps('password')} name="password" />
                            {formik.touched.password && formik.errors.password ? (
                                <div className="text-error">{formik.errors.password}</div>
                            ) : null}
                        </div>
                        <div className="inputBox">
                            <input type="password" placeholder='Xác nhận mật khẩu' {...formik.getFieldProps('confirmPassword')} name="confirmPassword" />
                            {formik.touched.confirmPassword && formik.errors.confirmPassword ? (
                                <div className="text-error">{formik.errors.confirmPassword}</div>
                            ) : null}
                        </div>
                        <div className="inputBox">
                            <input type="submit" value='Đăng kí' id='btn' />
                        </div>
                        <div className="group">
                            <button onClick={redictToLogin}>Hủy</button>
                            <button onClick={redictToLogin}>Đăng nhập</button>
                        </div>
                    </div>

                </form>
            )}
        </Formik>
    );
};
export default Register;