import React, { useEffect, useState } from "react";

import styled from "styled-components";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCloudMeatball as woobak } from "@fortawesome/free-solid-svg-icons"; 
import { faCloudMoon as cloudmoon } from "@fortawesome/free-solid-svg-icons";
import { faCloudMoonRain  as cloudmoonrain} from "@fortawesome/free-solid-svg-icons";
import { faCloudShowersHeavy as rain } from "@fortawesome/free-solid-svg-icons";
import { faCloudSun as cloudsun } from "@fortawesome/free-solid-svg-icons";
import { faCloudSunRain as cloudsunrain } from "@fortawesome/free-solid-svg-icons";
import { faMoon as moon } from "@fortawesome/free-regular-svg-icons";
import { faMoon as moonblur} from "@fortawesome/free-solid-svg-icons";
import { faUmbrella as umbrella } from "@fortawesome/free-solid-svg-icons";
import { faCloudBolt as cloudbolt } from "@fortawesome/free-solid-svg-icons";
import { faWind as wind } from "@fortawesome/free-solid-svg-icons";
import { faSun as sun } from "@fortawesome/free-regular-svg-icons";
import { faSun as sunblur } from "@fortawesome/free-solid-svg-icons";
import { faCloud as cloud } from "@fortawesome/free-solid-svg-icons";
import { faDroplet as droplet } from "@fortawesome/free-solid-svg-icons";
import { faTemperatureLow as temper } from "@fortawesome/free-solid-svg-icons";
import { faSnowflake as snow} from "@fortawesome/free-regular-svg-icons";
import { faCloudRain as smallrain } from "@fortawesome/free-solid-svg-icons";

// 온도 구간별 색. 카드 전체를 채우던 진한 색 대신
// 아주 옅은 틴트(tint) + 숫자/포인트에 쓰는 강조색(accent) 두 가지로 나눈다.
const Weathercolor={
    //accent 는 이제 글자색이 아니라 "왼쪽 띠 + 온도계 아이콘" 전용이라
    //밝은 카드/어두운 카드 양쪽에서 모두 보이는 중간 밝기로 잡았다.
    //30도이상
    veryhot:{ tint:"rgba(240, 105, 98, 0.15)",  accent:"#e2574a" },
    //20도이상
    hot:    { tint:"rgba(243, 169, 90, 0.16)",  accent:"#e8912e" },
    //10도이상
    warm:   { tint:"rgba(94, 191, 220, 0.16)",  accent:"#31a6c6" },
    //0도이상
    cool:   { tint:"rgba(92, 148, 246, 0.15)",  accent:"#4a88e8" },
    //영하
    cold:   { tint:"rgba(122, 110, 228, 0.17)", accent:"#6a61d8" }
}

// 크기(250x110, margin 10px)는 건드리지 않는다.
// Userweather2 의 슬라이드 keyframes 가 170/340/476px 같은 고정값을 쓰고 있어서
// 카드 높이가 바뀌면 애니메이션이 어긋난다.
const WeatherContainer=styled.div`
    width: 250px;
    height:110px;
    /* 세로 간격은 Weatheritemwrapper(CARD_PITCH)가 만든다.
       여기에 margin 을 주면 형제간 겹침으로 실제 간격이 달라진다. */
    margin: 0;
    visibility: ${props=>props.visi?"hidden" :"visible"};
    display: flex;
    flex-direction: column;
    overflow: hidden;

    position: relative;
    border: 1px solid ${(props)=>props.theme.border};
    border-radius: 16px;
    box-shadow: ${(props)=>props.theme.shadow};
    color: ${(props)=>props.theme.text};

    /* 바탕은 패널 표면, 그 위에 온도 틴트를 옅게 얹는다 */
    background-color: ${(props)=>props.theme.surface};
    background-image: radial-gradient(
        120% 90% at 100% 0%,
        ${(props)=>props.tempcolor?.tint || "transparent"} 0%,
        transparent 65%
    );

    /* 왼쪽 온도색 띠.
       온도를 글자색으로 표현하면 대비가 부족해지므로, 색은 여기로 빼고
       숫자는 항상 진한 본문색을 쓴다. */
    &::before{
        content:"";
        position:absolute;
        left:0;
        top:14px;
        bottom:14px;
        width:4px;
        border-radius: 0 4px 4px 0;
        background:${(props)=>props.tempcolor?.accent || "transparent"};
    }
`
const WeatherHeader=styled.div`
    display: flex;
    align-items: center;
    gap: 6px;
    padding: 0 12px;
    width: 100%;
    height: 58%;
`
const WeatherDate=styled.div`
    flex-shrink: 0;
`
const WeatherBody=styled.div`
    width: 100%;
    display: flex;
    height: 42%;
`
const Skyandtempdiv=styled.div`
    flex: 1;
    min-width: 0;
    display: flex;
    align-items: center;
`
const Skyicon=styled.div`
    flex: 1;
    min-width: 0;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    gap: 2px;
`
const Icondiv=styled.div`
  display: flex;
  justify-content: center; /* Centers horizontally */
  align-items: center; /* Centers vertically */
`
const Skytext=styled.div`
    display: flex;
    justify-content: center;
    width: 100%;
`
//내부텍스트위치 ㅜ
const Text=styled.div`
    /* "구름많음,빗방울,눈날림" 처럼 긴 문구는 두 줄로 접는다 */
    max-width: 100%;
    font-weight: 600;
    font-size: 11px;
    line-height: 1.25;
    letter-spacing: -0.02em;
    word-break: keep-all;
    color: ${(props)=>props.theme.textMuted};
    text-align: center;
`


const Tempcss=styled.div`
    display: flex;
    align-items: center;
    gap: 2px;
    flex-shrink: 0;
`
const Tempicon=styled.div`
    display: flex;
  justify-content: center; /* Centers horizontally */
  align-items: center; /* Centers vertically */
`
const Temptext=styled.div`
    display: flex;
    align-items: baseline;
    gap: 1px;
    font-weight: 750;
    font-size: 24px;
    letter-spacing: -0.04em;
    white-space: nowrap;
    /* 카드가 밝든 어둡든 항상 읽히도록 본문색을 쓴다 */
    color: ${(props)=>props.theme.text};
    /* 카드마다 숫자 폭이 흔들리지 않게 */
    font-variant-numeric: tabular-nums;
`
//온도 단위(°C)는 숫자보다 작고 흐리게
const Degree=styled.span`
    font-size: 13px;
    font-weight: 650;
    letter-spacing: 0;
    color: ${(props)=>props.theme.textMuted};
`

// 하단 지표 줄 (습도 / 강수 / 바람)
const Etc=styled.div`
    display: flex;
    align-items: center;
    width: 100%;
    padding: 0 10px 6px;
    border-top: 1px solid ${(props)=>props.theme.border};
`
const Humidity=styled.div`
    flex: 1;
    min-width: 0;
    display: flex;
    justify-content: center;
`
const Basecss=styled.div`
    display: flex;
    align-items: center;
    gap: 5px;
    padding-top: 5px;
`
const Raindrop=styled.div`
     flex: 1.4;
     min-width: 0;
     display: flex;
     justify-content: center;
`
const Windblow=styled.div`
     flex: 1;
     min-width: 0;
     display: flex;
     justify-content: center;
`
//지금필요없을듯
const Etcheader=styled.div`
    text-align: center;
`
//
const Etcicon=styled.div`
     display: flex;
     align-items: center;
     font-size: 11px;
     color:${(props)=>props.color};
`
const Etcresult=styled.div`
    font-size: 11px;
    font-weight: 600;
    letter-spacing: -0.02em;
    color: ${(props)=>props.theme.textMuted};
    white-space: nowrap;
`
const TimeContainer=styled.div`
     display: flex;
    width: 54px;
   flex-direction: column;
  align-items: flex-start;
  justify-content: center;
`
const Perioddiv=styled.div`
  font-weight: 600; 
    font-size: 11px; 
  color: ${(props)=>props.theme.textFaint};
  letter-spacing: -0.02em;
`
const Hourdiv=styled.div`
     font-size: 22px; 
  font-weight: 750; 
  line-height: 1.1;
  letter-spacing: -0.04em;
  color: ${(props)=>props.theme.text};      
`

function Userweatheritem2(props){

    const {dates}=props;
    const [data,setData]=useState({
        time:dates?.time||"",
        date:dates?.date||"",
        reh:dates?.reh||"",
        rn1:dates?.rn1||"",
        sky:dates?.sky||"",
        t1h:dates?.t1H||"",
        pty:dates?.pty||"",
        wsd:dates?.wsd||""
    });

    /*
    useEffect(()=>{
                   
          const sky1=Weatherpa.getsky(dates.sky)   
          const pty1=Weatherpa.getpty(dates.pty)      

          setData({...data,sky:sky1,pty:pty1})



    },[])
   */
    //온도에배경색 함수
    const tempthema=(t1h)=>{
        if(t1h>=30){
            return Weathercolor.veryhot
        }
        else if(t1h>=20) return Weathercolor.hot
        else if(t1h>=10) return Weathercolor.warm
        else if(t1h>=0) return Weathercolor.cool
        else return Weathercolor.cold
    }

    //날씨 이모티콘 정리
    //다음부턴 객체로 따로 조건만들어서하자.
    const Weatherimo=(sky,pty,hour,t1h)=>{
        let isnight=parseInt(hour)>=2000 ||parseInt(hour) <600?true:false
        //카드 배경이 밝아져서 흰색 아이콘은 보이지 않는다.
        //맑음은 해=주황/달=남보라, 구름·흐림은 회색으로 구분한다.
        let iscolor=sky==="1"?(isnight?"#6f78d8":"#eda32c"):"#7d8a97"

        if(sky==="1"){//맑음
            if(pty==="0") return (isnight?<><Icondiv><FontAwesomeIcon size={"2x"} color={iscolor} icon={moon}/></Icondiv><Skytext><Text>맑음</Text></Skytext></>:<><Icondiv><FontAwesomeIcon  color={iscolor} size={"2x"} icon={sun}/></Icondiv><Skytext><Text>맑음</Text></Skytext></>)
            else if(pty==="1") return (isnight? <><Icondiv><FontAwesomeIcon size={"2x"} color={iscolor} icon={cloudmoonrain}/></Icondiv><Skytext><Text>맑음,비</Text></Skytext></> :<><Icondiv><FontAwesomeIcon color={iscolor} size={"2x"} icon={cloudsunrain}/></Icondiv><Skytext><Text>맑음,비</Text></Skytext></> )
            else if(pty==="2") return (isnight?<> <Icondiv><FontAwesomeIcon size={"2x"} color={iscolor} icon={cloudmoonrain}/></Icondiv><Skytext><Text>맑음,비,눈</Text></Skytext></> :<><Icondiv><FontAwesomeIcon color={iscolor} size={"2x"} icon={cloudsunrain}/></Icondiv><Skytext><Text>맑음,비,눈</Text></Skytext></> )
            else if(pty==="3") return <><Icondiv><FontAwesomeIcon size={"2x"} color={iscolor} icon={snow}/></Icondiv><Skytext><Text>맑음,눈</Text></Skytext></>
            else if(pty==="5") return (isnight? <><Icondiv><FontAwesomeIcon size={"2x"} color={iscolor} icon={cloudmoonrain}/></Icondiv><Skytext><Text>맑음,빗방울</Text></Skytext></> :<><Icondiv><FontAwesomeIcon color={iscolor} size={"2x"} icon={cloudsunrain}/></Icondiv><Skytext><Text>맑음,빗방울</Text></Skytext></> )
            else if(pty==="6") return (isnight? <><Icondiv><FontAwesomeIcon size={"2x"} color={iscolor} icon={cloudmoonrain}/></Icondiv><Skytext><Text>맑음,빗방울,눈날림</Text></Skytext></> :<><Icondiv><FontAwesomeIcon color={iscolor} size={"2x"} icon={cloudsunrain}/></Icondiv><Skytext><Text>맑음,빗방울,눈날림</Text></Skytext></> )
            else if(pty==="7") return <><Icondiv><FontAwesomeIcon size={"2x"} color={iscolor} icon={snow}/></Icondiv><Skytext><Text>맑음,눈</Text></Skytext></>

        }else if(sky==="3"){//구름많음
            if(pty==="0") return (isnight?<><Icondiv><FontAwesomeIcon color={iscolor} size={"2x"} icon={cloudmoon}/></Icondiv><Skytext><Text>구름많음</Text></Skytext></>:<><Icondiv><FontAwesomeIcon color={iscolor} size={"2x"} icon={cloudsun}/></Icondiv><Skytext><Text>구름많음</Text></Skytext></>)
            else if(pty==="1")  return (<><Icondiv><FontAwesomeIcon color={iscolor} size={"2x"} icon={rain}/> </Icondiv><Skytext><Text>구름많음,비</Text></Skytext></>)
            else if(pty==="2")  return (<><Icondiv><FontAwesomeIcon color={iscolor} size={"2x"} icon={woobak}/> </Icondiv><Skytext><Text>구름많음,비,눈</Text></Skytext></>)
            else if(pty==="3") return <><Icondiv><FontAwesomeIcon color={iscolor} size={"2x"} icon={snow}/></Icondiv><Skytext><Text>구름많음,눈</Text></Skytext></>
            else if(pty==="5") return (<><Icondiv><FontAwesomeIcon color={iscolor} size={"2x"} icon={rain}/> </Icondiv><Skytext><Text>구름많음,빗방울</Text></Skytext></>)
            else if(pty==="6") return (<><Icondiv><FontAwesomeIcon color={iscolor} size={"2x"} icon={woobak}/> </Icondiv><Skytext><Text>구름많음,비방울,눈날림</Text></Skytext></>)
            else if(pty==="7") return <><Icondiv><FontAwesomeIcon color={iscolor} size={"2x"} icon={snow}/></Icondiv><Skytext><Text>구름많음,눈날림</Text></Skytext></>

        }else if(sky==="4"){//흐림
            if(pty==="0") return (isnight?<><Icondiv><FontAwesomeIcon color={iscolor} size={"2x"} icon={cloudmoon}/></Icondiv><Skytext><Text>흐림</Text></Skytext></>:<><Icondiv><FontAwesomeIcon color={iscolor} size={"2x"} icon={cloudsun}/></Icondiv><Skytext><Text>흐림</Text></Skytext></>)
                else if(pty==="1")  return (<><Icondiv><FontAwesomeIcon color={iscolor} size={"2x"} icon={rain}/> </Icondiv><Skytext><Text>흐림,비</Text></Skytext></>)
                else if(pty==="2")  return (<><Icondiv><FontAwesomeIcon color={iscolor} size={"2x"} icon={woobak}/> </Icondiv><Skytext><Text>흐림,비,눈</Text></Skytext></>)
                else if(pty==="3") return <><Icondiv><FontAwesomeIcon color={iscolor} size={"2x"} icon={snow}/></Icondiv><Skytext><Text>흐림,눈</Text></Skytext></>
                else if(pty==="5") return (<><Icondiv><FontAwesomeIcon color={iscolor} size={"2x"} icon={rain}/> </Icondiv><Skytext><Text>흐림,빗방울</Text></Skytext></>)
                else if(pty==="6") return (<><Icondiv><FontAwesomeIcon color={iscolor} size={"2x"} icon={woobak}/> </Icondiv><Skytext><Text>흐림,빗방울,눈날림</Text></Skytext></>)
                else if(pty==="7") return <><Icondiv><FontAwesomeIcon color={iscolor} size={"2x"} icon={snow}/></Icondiv><Skytext><Text>흐림,눈날림</Text></Skytext></>
        }
    }


    const timepar=(time)=>{
       const numtime= parseInt(time,10);

       //오전오후판별
       const period=numtime>=1200?"오후":"오전";

       let hours=Math.floor(numtime/100);
       if(hours>12){
            hours-=12;
       }else if(hours===0){
            hours=12; //자정처리
       }
       return (
        <TimeContainer>
        <Perioddiv>
        {period}
        </Perioddiv>
        <Hourdiv>{hours}시</Hourdiv>
        
        </TimeContainer>
       )
    }

    const temptheme=tempthema(data.t1h);

    return (
    <>
    
    {data.time!==""?
        
    <WeatherContainer tempcolor={temptheme}>
        <WeatherHeader>
        <WeatherDate>
        {timepar(data.time)}
     
        </WeatherDate>

        <Skyandtempdiv>

        <Skyicon>
    
    {//- 하늘상태(SKY) 코드 : 맑음(1), 구름많음(3), 흐림(4)
    
    
    // 강수형태(PTY) 코드 : (초단기) 없음(0), 비(1), 비/눈(2), 눈(3), 빗방울(5), 빗방울눈날림(6), 눈날림(7) 
    }
   
    {Weatherimo(data.sky,data.pty,data.time,data.t1h)}
    
    

    </Skyicon>
   
    <Tempcss>
        {/* 색은 왼쪽 띠와 온도계 아이콘이 맡고, 숫자는 본문색으로 또렷하게 */}
        <Tempicon>
            <FontAwesomeIcon icon={temper} size={"sm"} color={temptheme.accent}/>
        </Tempicon>
        <Temptext>{data.t1h}<Degree>°C</Degree></Temptext>
    </Tempcss>
    </Skyandtempdiv>
        </WeatherHeader>
        <WeatherBody>
   

   
    <Etc>
    <Humidity>
        <Basecss>
        
        <Etcicon color="#3d7ede">
        <FontAwesomeIcon icon={droplet} />  
        </Etcicon>
        <Etcresult>
        {data.reh}% 
        </Etcresult>
    
        </Basecss>
    
   
  
    </Humidity>
    <Raindrop>
    <Basecss>
  
            <Etcicon color="#5a6fa8">
            <FontAwesomeIcon icon={umbrella} />
            </Etcicon>
            <Etcresult>
            {data.rn1}
            </Etcresult>
    
    
            </Basecss>
    </Raindrop>
   
    <Windblow>
    <Basecss>
    
            <Etcicon color="#7d8a97">
            <FontAwesomeIcon icon={wind} />  
            </Etcicon>
            <Etcresult>
            {data.wsd}m/s
            </Etcresult>
    
    
    
            </Basecss>
  
    </Windblow>
    
   
    
    </Etc>
   
    
    </WeatherBody>
    
    </WeatherContainer>
    :<WeatherContainer visi={true}>노데이터</WeatherContainer>}
    </>
    )

}
export default Userweatheritem2;