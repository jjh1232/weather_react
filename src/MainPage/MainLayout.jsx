import React from "react";
import styled from "styled-components";
import Header from "./Header";
import AdminLeft from "../admin/AdminLeft";
import LeftSideBar from "./LeftSideBar";
import RightSideBar from "./RightSideBar";
import { Outlet } from "react-router-dom";
import WeatherComponent from "./WeatherComponent";


const Wrapper=styled.div`
    background-color: white;
    background-repeat: no-repeat;
    background-position: top center;
    background-size: cover;
    position: fixed;
    overflow: auto;
    width: 100%;
    height: 100vh;
`
export default function MainLayout(props){
    const {children}=props

    return (
        <Wrapper>
        <WeatherComponent/>
        <Header/>
        <AdminLeft/>
        <LeftSideBar/>
        
        <RightSideBar/>  

        <Outlet/>
        </Wrapper>
    )
}