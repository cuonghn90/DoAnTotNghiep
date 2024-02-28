import './App.css';
import Pages from 'pages';
import Home from 'pages/Home';
import Setting from 'pages/Setting';
import Category from 'pages/Category';
import NotFound from 'pages/NotFound';
import MessagePage from 'pages/Message';
import ManageFood from 'pages/ManageFood';
import ManageOrders from 'pages/ManageOrders';
import Login from 'pages/Authentication/Login';
import { Navigate, Route, Routes, useNavigate } from 'react-router-dom';
import Authentication from 'pages/Authentication';
import Register from 'pages/Authentication/Register';
import ResetPassword from 'pages/Authentication/ResetPassword';
import ForgotPassword from 'pages/Authentication/ForgotPassword';
import ProfileSetting from 'pages/Setting/components/ProfileSetting';
import SecuritySetting from 'pages/Setting/components/SecuritySetting';
import AppearanceSetting from 'pages/Setting/components/AppearanceSetting';
import { useEffect } from 'react';
import { useAppDispatch } from 'store/hook';
import { getCategorys, getCategorysAndProduct } from 'pages/Category/categorySlice';
import ManageCoupon from 'pages/ManageCoupon';

function App () {

  const dispatch = useAppDispatch()



  return (
    <Routes>
      <Route path="/" element={ <Pages />}>
        <Route path="/" element={<Home />}></Route>
        <Route path="/manage-products" element={<ManageFood />}></Route>
        <Route path="/manage-orders" element={<ManageOrders />}></Route>
        <Route path="/manage-categorys" element={<Category />}></Route>
        <Route path="/manage-coupons" element={<ManageCoupon />}></Route>
        <Route path="/message" element={<MessagePage />}></Route>
        <Route path="/setting" element={<Setting />}>
          <Route path="/setting/appearance" element={<AppearanceSetting />}></Route>
          <Route path="/setting/profile" element={<ProfileSetting />}></Route>
          <Route path="/setting/security" element={<SecuritySetting />}></Route>
        </Route>
      </Route>
      <Route path="/auth" element={<Authentication />}>
        <Route index path="/auth/login" element={<Login />}></Route>
        <Route path="/auth/register" element={<Register />}></Route>
        <Route path="/auth/reset-password" element={<ResetPassword />}></Route>
        <Route path="/auth/forgot-password" element={<ForgotPassword />}></Route>
      </Route>
      <Route path="*" element={<NotFound />}></Route>
    </Routes>
  );
}

export default App;
