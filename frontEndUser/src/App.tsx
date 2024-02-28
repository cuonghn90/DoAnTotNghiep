import { Route, Routes } from 'react-router-dom';
import './App.css';
import Pages from 'pages';
import Home from 'pages/Home';
import Discover from 'pages/Discover';
import HistoryPage from 'pages/HistoryPage';
import MessagePage from 'pages/Message';
import Setting from 'pages/Setting';
import AppearanceSetting from 'pages/Setting/components/AppearanceSetting';
import ProfileSetting from 'pages/Setting/components/ProfileSetting';
import SecuritySetting from 'pages/Setting/components/SecuritySetting';
import NotFound from 'pages/NotFound';
import Authentication from 'pages/Authentication';
import Login from 'pages/Authentication/Login';
import Register from 'pages/Authentication/Register';
import ResetPassword from 'pages/Authentication/ResetPassword';
import ForgotPassword from 'pages/Authentication/ForgotPassword';
import Cart from 'pages/Cart';
import { useEffect } from 'react';
import { useAppDispatch } from 'store/hook';
import { getCategorys } from 'pages/Category/categorySlice';
import MyCoupon from 'pages/Setting/components/MyCoupon';
import FriendPage from 'pages/FriendPage';
import { getProducts } from 'pages/Home/productSlice';

function App () {

  const dispatch = useAppDispatch()

  // useEffect
  useEffect(() => {
    async function getFristCategory () {
      await dispatch(getCategorys());
    }
    getFristCategory();
    
  }, []);

  return (
    <Routes>
      <Route path="/" element={<Pages />}>
        {/* <Route index path="/" element={<Home />}></Route> */}
        <Route path="/" element={<Discover />}>
          <Route index path="/" element={<Discover />}></Route>
          <Route path="/product/:id" element={<Discover />}></Route>
          <Route path="/product" element={<Discover />}></Route>
        </Route>
        <Route path="/cart" element={<Cart />}></Route>
        <Route path="/history" element={<HistoryPage />}></Route>
        <Route path="/friend" element={<FriendPage />}></Route>
        <Route path="/message" element={<MessagePage />}></Route>
        <Route path="/setting" element={<Setting />}>
          <Route index path="/setting/appearance" element={<AppearanceSetting />}></Route>
          <Route path="/setting/profile" element={<ProfileSetting />}></Route>
          <Route path="/setting/security" element={<SecuritySetting />}></Route>
          <Route path="/setting/my-coupon" element={<MyCoupon />}></Route>
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
