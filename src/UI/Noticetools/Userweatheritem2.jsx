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

const Weathercolor={
    //30도이상
    veryhot:" rgba(255,85,85,0.8)",
    //20도이상
    hot:" rgba(255, 176, 4, 0.979)",
    //10도이상
    warm:" rgba(154,231,197,0.8)",
    //0도이상
    cool:" rgba(112,185,220,0.8)",
    //영하
    cold:" rgba(67,29,180,0.8)"

    

}

const WeatherContainer=styled.div`
    width: 250px;
    height:110px;
    border: 1px solid black;

    //background-color: #9fd1fa; //마지막두자리가투명도 16진수임
    visibility: ${props=>props.visi?"hidden" :"visable"};
    margin: 10px;
    display: flex;
    flex-direction: column;
    background-color:${(props) => props.tempcolor}
    
  
`
const WeatherHeader=styled.div`
    display: flex;
    
    width: 100%;
    color: black;
    height: 50%;
   
    text-align: center;
`
const WeatherDate=styled.div`
    width: 35%;
   
    

`
const WeatherBody=styled.div`
    width: 100%;
    display: flex;
    
   height: 50%;
`
const Skyandtempdiv=styled.div`
 
    width: 65%;
    display: flex;
    
`
const Skyicon=styled.div`
    width: 50%;
    height: 100%;
    
   
    
`
const Icondiv=styled.div`
  display: flex;
  justify-content: center; /* Centers horizontally */
  align-items: center; /* Centers vertically */
top: 2px;
  position: relative;
  left: 13px;
  width: 70%;
     
  height: 55%; /* Set a height for the container */
`
const Skytext=styled.div`
    position: relative;
    display: flex;
    top: 2px;
    width: 190%;
    
   
    left:15px;
   //border-top: 1px solid gray;
   //border-left: 1px solid gray;
    height: 40%;
 
`
//내부텍스트위치 ㅜ
const Text=styled.div`

    max-width: 150px;
    font-weight: 700;
    font-size: 15px;
    
    text-align: center;
`


const Tempcss=styled.div`
    display: flex;
    width: 50%;
    position: relative;
  
    overflow: hidden;
    
    padding-top:5px;
`
const Tempicon=styled.div`
    display: flex;
  justify-content: center; /* Centers horizontally */
  align-items: center; /* Centers vertically */
  //border: 1px solid blue;
  position: relative;
  right: 0%;
  height: 70%; /* Set a height for the container */
`
const Temptext=styled.div`
    position: relative;
    width: 60px;
    text-align: center;
    top:12%;
    right: 6%;
    font-weight: bold; 
    height: 70%;
    font-size: 25px;
    color: ${(props)=>props.textcolor};
    //border: 1px solid blue;
`

const Etc=styled.div`
    display: flex;
    
    width: 100%;
    border: 1px solid black;
`
const Humidity=styled.div`
    width: 25%;
    display: flex;
    
    flex-direction: column;
    
`
const Basecss=styled.div`
    display: flex;
    flex-direction: column;
    //background-color: white;
    border-radius: 20%;
    width: 70px;
    margin: 3px;
    
    
`
const Raindrop=styled.div`
     width: 48%;
     display: flex;
     align-items: center;
 
     flex-direction: column;
`
const Windblow=styled.div`
     width: 25%;
   
     display: flex;
     flex-direction: column;
`
//지금필요없을듯
const Etcheader=styled.div`
    text-align: center;
    background-color: white;
 
`
//
const Etcicon=styled.div`
     text-align: center;
     //background-color:white;
     color:${(props)=>props.color}  
          
    
`
const Etcresult=styled.div`
     text-align: center;
    // background-color: white;
    color: black;
        white-space: nowrap;
       
`
const TimeContainer=styled.div`
     display: flex;
     //height: 71px;
 // border:1px solid blue;
    width: 100px;
   flex-direction: column;
  align-items: center; /* 가로 중앙 정렬 */
  justify-content: center; /* 세로 중앙 정렬 */
  font-family: Arial, sans-serif;
 // border: 1px solid black;
`
const Perioddiv=styled.div`
    position: relative;
    //top:1px;
  font-weight: 600; 
    font-size: 15px; 
  color: black; 
  //margin-bottom: 5px;
 /* font-weight    :bold ;
 margin-top:auto;
  margin-bottom: 20px;
  margin-left: 4px;
  margin-right:1px;
  */
 
`
const Hourdiv=styled.div`
    text-align: center;
    align-items: center;
    position: relative;
    //top:2px;
   bottom: 10px;
    margin-bottom: 25px;
     font-size: 30px; 
  font-weight: bold; 
  color: black;      
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
        let iscolor=parseInt(t1h)>10?"red":"blue"

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

    return (
    <>
    
    {data.time!==""?
        
    <WeatherContainer tempcolor={tempthema(data.t1h)}>
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
        {parseInt(data.t1h)<0
        ?<><Tempicon><FontAwesomeIcon icon={temper} size={"xl"} color="blue"/></Tempicon> <Temptext textcolor="blue">{data.t1h+"\u2103" } </Temptext> 
        
        </> 
        : <><Tempicon><FontAwesomeIcon icon={temper} size={"xl"} color="red"/> </Tempicon><Temptext textcolor="red">{data.t1h+"\u2103" } </Temptext>
       
        </>}
   
    
    
    </Tempcss>
    </Skyandtempdiv>
        </WeatherHeader>
        <WeatherBody>
   

   
    <Etc>
    <Humidity>
        <Basecss>
        
        <Etcicon color="deepskyblue">
        <FontAwesomeIcon icon={droplet} size="xl"/>  
        </Etcicon>
        <Etcresult>
        {data.reh}% 
        </Etcresult>
    
        </Basecss>
    
   
  
    </Humidity>
    <Raindrop>
    <Basecss>
  
            <Etcicon color="navy">
            <FontAwesomeIcon icon={umbrella} size="xl"/>
            </Etcicon>
            <Etcresult>
            {data.rn1}
            </Etcresult>
    
    
            </Basecss>
    </Raindrop>
   
    <Windblow>
    <Basecss>
    
            <Etcicon color="black">
            <FontAwesomeIcon icon={wind} size="xl"/>  
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