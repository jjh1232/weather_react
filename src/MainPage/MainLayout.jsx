import React, { useEffect, useState } from "react";
import styled, { ThemeProvider } from "styled-components";
import Header from "./Header";
import AdminLeft from "../admin/AdminLeft";
import LeftSideBar from "./LeftSideBar";
import RightSideBar from "./RightSideBar";
import { Outlet } from "react-router-dom";
import WeatherComponent from "./WeatherComponent";
import { useCookies } from "react-cookie";
import SkyObject from "./WeatherObject/SkyObject";

const Wrapper=styled.div`
   
    
    
`
//날짜에따른테마
const thema={
    dawn: {
        sky: ['#4B6CB7', '#8E9EC6','#D7E1EC'],
        horizon: '#90EE90',
        ground: ['#eec1a2', '#180903']
      },
      morning: {
        sky: ['#89b8df', '#87CEFA','#C9E4CA '],
        horizon: '#FF6347',
        ground: ['#eec1a2', '#180903']
      },
        noon: {
        sky: ['#c9ddee', '#c0d6dd',' #d9e4ee'],
        horizon: '#FF6347',
        ground: ['#eec1a2', '#180903']
      },
      evening: {
        sky: ['#1A1D23', '#6495ED','#FFD700'],
        horizon: '#FF6347',
        ground: ['#eec1a2', '#180903']
      },
      night: {
      
        sky: ['#677ba3', '#2d4b88','#1A1D23'],
        horizon: '#FF6347',
        ground: ['#a09c9a', '#a29fa5']
      }
}
// 1. 기본 구조 선택
const Background = styled.div`
  position: fixed;
  width: 100%;
  height: 100vh;
  bottom:50px;
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
  height: 15%;
  background: 
    linear-gradient(
      0deg,
      ${({ theme }) => theme.ground[0]} 0%,
      ${({ theme }) => theme.ground[1]} 100%
    );
`;


export default function MainLayout(props){
    const [currentthema,setCurrentthema]=useState(thema.dawn);
    const [weathercookie,removeweather]=useCookies(['weather'])//어차피쿠키다가져오는데이유는몰겟음
    const [weatherdata,setWeatherdata]=useState();


    //동기화를위해 유즈이펙트가좋다네요..
    useEffect(()=>{
        //데이터존재여부확인이안전하다고함
      if (!weathercookie.weather) {
        setWeatherdata({});
        return;
      }
      //안전하게json파싱
      try{
        //const parsed=JSON.parse(weathercookie.weather)
        //console.log("제대로왔는가:"+parsed)
      const weathercook={
        sky:weathercookie.weather.sky||1,
        pty:weathercookie.weather.pty||0,
        t1h:weathercookie.weather.t1h||10,
        rn1:weathercookie.weather.rn1||0
      }

      setWeatherdata(prev=>JSON.stringify(prev)===JSON.stringify(weathercook)
    ?prev //변경사항 없으면 리렌더링안함
    :weathercook//변경시
    )
    }
    catch(error){
      console.log("쿠키파싱실패:"+error)
      setWeatherdata({});
    }
    },[weathercookie.weather])

    //날씨에다른 변화


    
//시간에따른 배경변화
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
            
                <Sky>
                {weatherdata&&<SkyObject sky={weatherdata.sky} />}
                   
                </Sky>
                <Horizon></Horizon>
                <Ground></Ground>
            </Background>
            </ThemeProvider>
            
            <Header/>
        <AdminLeft/>
        <LeftSideBar/>
        
        <RightSideBar/>  

        <Outlet/>
        
        </Wrapper>
    )
}