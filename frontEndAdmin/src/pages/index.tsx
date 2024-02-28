import Layout from "antd/es/layout/layout";
import TheContainer from "layout/TheContainer";
import TheHeader from "layout/TheHeader";
import TheNavbar from "layout/TheNavbar";
import './style.css'
import { Outlet, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { useAppDispatch, useAppSelector } from "store/hook";
import { getAllUser } from "./Authentication/AuthenSlice";
import { getCategorys, getCategorysAndProduct } from "./Category/categorySlice";
const Pages = () => {
    // store
    const { userInfo } = useAppSelector(state => state.authStore);
    const dispatch = useAppDispatch()
    // useState
    const [navbarSelected, setNavbarSelected] = useState('');

    // Function
    const changeNavbarSeleted = (link: string) => {
        setNavbarSelected(link);
    }

    // useNavigate
    const navigate = useNavigate();

    // useEffect
    useEffect(() => {
        if (!localStorage.getItem("userToken")) {
            navigate('/auth/login');
        }
    }, [localStorage.getItem("userToken")])
    useEffect(()=>{
        if(userInfo.userId){
            dispatch(getAllUser('user'))
        }
    }, [userInfo.userId])
    // useEffect
    useEffect(() => {
        dispatch(getCategorys());
        dispatch(getCategorysAndProduct());
    }, [])
    return(
        <Layout style={{ height: '100vh' }} hasSider>
            <TheNavbar navbarSelected={navbarSelected} changeNavbarSeleted={changeNavbarSeleted} />
            <Layout className="main-layout">
                <TheHeader changeNavbarSeleted={changeNavbarSeleted} />
                <TheContainer>
                    <Outlet></Outlet>
                </TheContainer>
            </Layout>
        </Layout>
    )
}
export default Pages;