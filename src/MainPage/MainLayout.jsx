import React, { useState } from "react";
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
//날짜에따른테마
const thema={
    dawn: {
        sky: ['#87CEEB', '#64BFFF'],
        horizon: '#90EE90',
        ground: ['#8B4513', '#A0522D']
      },
      morning: {
        sky: ['#FF4500', '#FFD700'],
        horizon: '#FF6347',
        ground: ['#8B0000', '#A52A2A']
      },
        noon: {
        sky: ['#FF4500', '#FFD700'],
        horizon: '#FF6347',
        ground: ['#8B0000', '#A52A2A']
      },
      evening: {
        sky: ['#FF4500', '#FFD700'],
        horizon: '#FF6347',
        ground: ['#8B0000', '#A52A2A']
      },
      night: {
        sky: ['#FF4500', '#FFD700'],
        horizon: '#FF6347',
        ground: ['#8B0000', '#A52A2A']
      }
}
// 1. 기본 구조 선택
const Background = styled.div`
  position: fixed;
  width: 100%;
  height: 100vh;
  z-index: -10px;
  //overflow: hidden;
 `

// 2. 하늘 레이어
const Sky = styled.div`
  height: 90%;
  //그라데이션 아마 시간대별로 조정
  background: linear-gradient( 
    0deg,
    ${({ thema }) => thema.sky[0]} 0%,
    ${({ thema }) => thema.sky[1]} 100%
  );
`;

// 3. 지평선 효과
const Horizon = styled.div`
  height: 10px;
  background: ${({ $thema}) => $thema[0]};
  box-shadow: 0 0 10px rgba(144,238,144,0.5);
`;

// 4. 땅 레이어
const Ground = styled.div`
  height: 12%;
  background: 
    linear-gradient(
      0deg,
      ${({ thema }) => thema.sky[0]} 0%,
      ${({ thema }) => thema.sky[1]} 100%
    );
`;


export default function MainLayout(props){
    const [thema,setThema]=useState();

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