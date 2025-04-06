import React, { useState, useEffect } from 'react';
import styled, { keyframes } from 'styled-components';
import SkyObject from './WeatherObject/SkyObject';

const rainAnimation = keyframes`
  0% { transform: translateY(-100%); }
  100% { transform: translateY(100%); }
`;

const sunAnimation = keyframes`
  0% { transform: scale(1); }
  50% { transform: scale(1.1); }
  100% { transform: scale(1); }
`;

const WeatherBackground = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  overflow: hidden;
  
  border: 5px solid blue;
`;

const RainDrop = styled.div`
  position: absolute;
  width: 1px;
  height: 10px;
  z-index: -10;
  background-color: #7EB2DD;
  animation: ${rainAnimation} 1s linear infinite;
`;

const Sun = styled.svg`
  position: absolute;
  top: 50px;
  left: 50%;
  transform: translateX(-50%);
  width: 100px;
  height: 100px;
  animation: ${sunAnimation} 3s ease-in-out infinite;
`;

export default function WeatherComponent(props){
  const {sky,pty,t1h,rn1}=props;
    
  //하늘상태 아마여기서 태양이나달도생각해야할듯
  const skyrender=(sky)=>{
    if(sky===1){
      //맑음
      return (
        <>
        
        </>
      )
    }
    else if(sky===3){
        //구름많음
    }
    else{
      //흐림
    }
  }


  //강수상태와 강수량
  const renderWeatherEffect = (pty,rn1) => {
      if(pty===0){
        //없음
      }
      else if(pty===1){
        //비
      }
      else if(pty===2){
        //비/눈

      }
      else if(pty===3){
        //눈
      }
      else if(pty===5){
        //빗방울
      }
      else if (pty===6){
        //빗방울눈날림
      }
      else {
        //(7)눈날림

      }
    return Array.from({ length: 40 }).map((_, index) => (
        <RainDrop
          key={index}
          style={{
            left: `${Math.random() * 100}%`,
            animationDuration: `${Math.random() * 0.5 + 0.5}s`,
            animationDelay: `${Math.random() * 2}s`,
          }}
        />
      ));
  }
  //기온에따른상태
  const temprender=(t1h)=>{

  }
 return (
    <WeatherBackground>
      {renderWeatherEffect()}
      <SkyObject sky={sky}/>
    </WeatherBackground>
  );
}