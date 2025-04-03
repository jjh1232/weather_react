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
    min-height: 100vh;
    overflow: auto;
    width: 100%;
    
    
`
// 1. 기본 구조 선택
const Background = styled.div`
  position: fixed;
  width: 100%;
  height: 100vh;
  z-index: -10px;
  //overflow: hidden;
`;

// 2. 하늘 레이어
const Sky = styled.div`
  height: 90%;
  background: linear-gradient(
    180deg,
    rgba(135,206,235,1) 0%,
    rgba(0,191,255,1) 100%
  );
`;

// 3. 지평선 효과
const Horizon = styled.div`
  height: 10px;
  background: rgba(144,238,144,0.8);
  box-shadow: 0 0 10px rgba(144,238,144,0.5);
`;

// 4. 땅 레이어
const Ground = styled.div`
  height: 12%;
  background: 
    linear-gradient(
      0deg,
      rgba(139,69,19,1) 0%,
      rgba(160,82,45,1) 100%
    );
`;
export default function MainLayout(props){
    const {children}=props

    return (
        <Wrapper>
            <Background>
                <Sky></Sky>
                <Horizon></Horizon>
                <Ground></Ground>
            </Background>
        <WeatherComponent/>
        <Header/>
        <AdminLeft/>
        <LeftSideBar/>
        
        <RightSideBar/>  

        <Outlet/>
        
        </Wrapper>
    )
}