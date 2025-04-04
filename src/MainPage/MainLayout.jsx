import React, { useEffect, useState } from "react";
import styled, { ThemeProvider } from "styled-components";
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
        sky: ['#4B6CB7', '#8E9EC6','#D7E1EC'],
        horizon: '#90EE90',
        ground: ['#8B4513', '#A0522D']
      },
      morning: {
        sky: ['#89b8df', '#87CEFA','#C9E4CA '],
        horizon: '#FF6347',
        ground: ['#8B0000', '#A52A2A']
      },
        noon: {
        sky: ['#c9ddee', '#c0d6dd',' #d9e4ee'],
        horizon: '#FF6347',
        ground: ['#8B0000', '#A52A2A']
      },
      evening: {
        sky: ['#1A1D23', '#6495ED','#FFD700'],
        horizon: '#FF6347',
        ground: ['#8B0000', '#A52A2A']
      },
      night: {
        sky: ['#1A1D23', '#1A1D23','#1A1D23'],
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
    ${({ theme }) => theme.sky[0]} 0%,
    ${({ theme }) => theme.sky[1]} 50%,
    ${({ theme }) => theme.sky[2]} 100%
  );
`;

// 3. 지평선 효과
const Horizon = styled.div`
  height: 10px;
  background: ${({ theme}) => theme.horizon[0]};
  box-shadow: 0 0 10px rgba(144,238,144,0.5);
`;

// 4. 땅 레이어
const Ground = styled.div`
  height: 12%;
  background: 
    linear-gradient(
      0deg,
      ${({ theme }) => theme.ground[0]} 0%,
      ${({ theme }) => theme.ground[1]} 100%
    );
`;


export default function MainLayout(props){
    const [currentthema,setCurrentthema]=useState(thema.dawn);

    const Weatherandtime=()=>{
      let time=new Date().getHours();
     // let time=String(now.getHours.padStart(2,'0'))//한자리숫자를위해padstart

      if(time>=4 &&time<7) setCurrentthema(thema.dawn)
      else if(time>=7 &&time<12) setCurrentthema(thema.morning)
      else if(time>=12 &&time<17) setCurrentthema(thema.noon)
      else if(time>=17 &&time<20) setCurrentthema(thema.evening)
      else setCurrentthema(thema.night)


      
    }
    //날씨정리코드
    //구름이나해등추가해야하는데흠..

    //실행유즈이펙트
    useEffect(()=>{
      Weatherandtime();
      const interval=setInterval(Weatherandtime,60000*60)//1시간마다체크

      return ()=>clearInterval(interval) //
    },[])
    return (
        <Wrapper>
            <ThemeProvider theme={currentthema}>
            <Background>
                <Sky></Sky>
                <Horizon></Horizon>
                <Ground></Ground>
            </Background>
            </ThemeProvider>
        <WeatherComponent/>
        <Header/>
        <AdminLeft/>
        <LeftSideBar/>
        
        <RightSideBar/>  

        <Outlet/>
        
        </Wrapper>
    )
}