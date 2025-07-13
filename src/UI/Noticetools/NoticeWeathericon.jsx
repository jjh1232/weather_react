import React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSun } from "@fortawesome/free-solid-svg-icons";
import { faCloud } from "@fortawesome/free-solid-svg-icons";
import { faCloudRain } from "@fortawesome/free-solid-svg-icons";
import { faTint } from "@fortawesome/free-solid-svg-icons";
import { faTemperatureLow } from "@fortawesome/free-solid-svg-icons";
import { faWind } from "@fortawesome/free-solid-svg-icons";
import styled from "styled-components";


const skyMap = {
    '1': { icon: faSun, color: 'gold', label: '맑음' },
    '3': { icon: faCloud, color: 'gray', label: '구름많음' },
    '4': { icon: faCloud, color: 'darkgray', label: '흐림' }
  };
  
  const ptyMap = {
    '0': { icon: faCloud, color: 'skyblue', label: '맑음' },
    '1': { icon: faCloudRain, color: 'blue', label: '비' },
    '2': { icon: faCloudRain, color: 'deepskyblue', label: '비/눈' },
    '3': { icon: faCloudRain, color: 'gray', label: '눈' }
  };

  export default function NoticeWeathericon({type,value}){
    let iconInfo=null;
    switch (type) {
        case 'sky':
          iconInfo = skyMap[value];
          break;
        case 'pty':
          iconInfo = ptyMap[value];
          break;
        case 'temp':
          iconInfo = { icon: faTemperatureLow, color: 'tomato', label: `${value}°C` };
          break;
        case 'rain':
          iconInfo = { icon: faTint, color: 'blue', label: value==="강수없음"?`${value}`:`${value}mm` };
          break;
        case 'reh':
          iconInfo = { icon: faTint, color: 'deepskyblue', label: `${value}%` };
          break;
        case 'wsd':
          iconInfo = { icon: faWind, color: 'gray', label: `${value}m/s` };
          break;
        default:
          iconInfo = null;
      }
    
      if (!iconInfo) return null;

      return (
        <Wrapper >
          <FontAwesomeIcon icon={iconInfo.icon} color={iconInfo.color} />
          <Labeltext>{iconInfo.label}</Labeltext>
        </Wrapper>
      );
  }

  const Wrapper=styled.span`
    display: inline-flex;
    align-items: center;
    gap: 3px;
      display: flex;
  justify-content: center;  /* 가로(주축) 중앙 정렬 */
  align-items: center;      /* 세로(교차축) 중앙 정렬 */
  `
  const Labeltext=styled.span`
    font-size: 14px;
      display: flex;
  justify-content: center;  /* 가로(주축) 중앙 정렬 */
  align-items: center;      /* 세로(교차축) 중앙 정렬 */
  `