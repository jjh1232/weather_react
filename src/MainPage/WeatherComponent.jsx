import React, { useState, useEffect } from 'react';
import styled, { keyframes } from 'styled-components';

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

export default function WeatherComponent(){

    
  const renderWeatherEffect = () => {
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
 return (
    <WeatherBackground>
      {renderWeatherEffect()}
    </WeatherBackground>
  );
}