import TheContainer from 'layout/TheContainer';
import TheHeader from 'layout/TheHeader';
import TheNavbar from 'layout/TheNavbar';
import { Outlet, useLocation } from 'react-router-dom';
import { Layout } from 'antd';
import { useCallback, useEffect, useState } from 'react';
import { useAppDispatch, useAppSelector } from 'store/hook';
import { getCoupons } from './Setting/components/MyCoupon/couponSlice';
const Pages = () => {

    // store
    const dispatch = useAppDispatch()
    const {userInfo} = useAppSelector(state => state.authStore)

    // useState
    const [collapsed, setCollapsed] = useState(false);
    const [navbarSelected, setNavbarSelected] = useState('');

    // Function
    const changeCollapsed = (isCollapsed: boolean) => {
        setCollapsed(isCollapsed)
    }

    const changeNavbarSeleted  = (link: string) => {
        setNavbarSelected(link)
    }

    useEffect(()=>{
        if(userInfo.userId){
            dispatch(getCoupons({ search:'', status:'', startDate:'', endDate:'' }))
        }
    }, [userInfo.userId])

    return (
        <Layout style={{ minHeight: '100vh' }} hasSider>
            <TheNavbar collapsed={collapsed} setCollapsed={changeCollapsed} navbarSelected={navbarSelected} changeNavbarSeleted={changeNavbarSeleted}></TheNavbar>
            <Layout className='layout-right'>
                <TheHeader changeNavbarSeleted={changeNavbarSeleted} collapsed={collapsed} setCollapsed={changeCollapsed}></TheHeader>
                <TheContainer>
                    <Outlet></Outlet>
                </TheContainer>
            </Layout>
        </Layout>
    );
};
export default Pages;