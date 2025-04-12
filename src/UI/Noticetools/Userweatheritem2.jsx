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
const WeatherContainer=styled.div`
    width: 250px;
    height:85px;
    border: 1px solid black;
    background-color: #9fd1fa; //마지막두자리가투명도 16진수임
    visibility: ${props=>props.visi?"hidden" :"visable"};
`
const WeatherHeader=styled.div`
    color: black;
`
const WeatherDate=styled.div`
    
`
const WeatherBody=styled.div`
    display: flex;
`
const Skyicon=styled.div`
    width: 20%;
    height: 100%;

    border: 1px solid blue;
`
const Icondiv=styled.div`
  display: flex;
  justify-content: center; /* Centers horizontally */
  align-items: center; /* Centers vertically */
  border: 1px solid black;
  height: 40px; /* Set a height for the container */
`
const Skytext=styled.div`
    text-align: center;
`



const Tempcss=styled.div`
    width: 15%;
    border: 1px solid green;
`
const Tempicon=styled.div`
    display: flex;
  justify-content: center; /* Centers horizontally */
  align-items: center; /* Centers vertically */
  border: 1px solid black;
  height: 40px; /* Set a height for the container */
`
const Temptext=styled.div`
    text-align: center;
`

const Etc=styled.div`
    display: flex;
    width: 65%;
    border: 1px solid black;
`
const Humidity=styled.div`
    width: 25%;
    display: flex;
    flex-direction: column;
`
const Raindrop=styled.div`
     width: 50%;
     display: flex;
     flex-direction: column;
`
const Windblow=styled.div`
     width: 25%;
     display: flex;
     flex-direction: column;
`
const Etcheader=styled.div`
    text-align: center;
`
const Etcicon=styled.div`
     text-align: center;
`
const Etcresult=styled.div`
     text-align: center;
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
    //날씨 이모티콘 정리
    
    const Weatherimo=(sky,pty,hour)=>{
        let isnight=parseInt(hour)>=2000 ||parseInt(hour) <600?true:false

        if(sky==="1"){//맑음
            if(pty==="0") return (isnight?<><Icondiv><FontAwesomeIcon size={"2x"} icon={moon}/></Icondiv><Skytext>맑음</Skytext></>:<><Icondiv><FontAwesomeIcon size={"2x"} icon={sun}/></Icondiv><Skytext>맑음</Skytext></>)
            else if(pty==="1") return (isnight? <><Icondiv><FontAwesomeIcon size={"2x"} icon={cloudmoonrain}/></Icondiv><Skytext>맑음,비</Skytext></> :<><Icondiv><FontAwesomeIcon size={"2x"} icon={cloudsunrain}/></Icondiv><Skytext>맑음,비</Skytext></> )
            else if(pty==="2") return (isnight?<> <Icondiv><FontAwesomeIcon size={"2x"} icon={cloudmoonrain}/></Icondiv><Skytext>맑음,비,눈</Skytext></> :<><Icondiv><FontAwesomeIcon size={"2x"} icon={cloudsunrain}/></Icondiv><Skytext>맑음,비,눈</Skytext></> )
            else if(pty==="3") return <><Icondiv><FontAwesomeIcon size={"2x"} icon={snow}/></Icondiv><Skytext>맑음,눈</Skytext></>
            else if(pty==="5") return (isnight? <><Icondiv><FontAwesomeIcon size={"2x"} icon={cloudmoonrain}/></Icondiv><Skytext>맑음,빗방울</Skytext></> :<><Icondiv><FontAwesomeIcon size={"2x"} icon={cloudsunrain}/></Icondiv><Skytext>맑음,빗방울</Skytext></> )
            else if(pty==="6") return (isnight? <><Icondiv><FontAwesomeIcon size={"2x"} icon={cloudmoonrain}/></Icondiv><Skytext>맑음,빗방울,눈날림</Skytext></> :<><Icondiv><FontAwesomeIcon size={"2x"} icon={cloudsunrain}/></Icondiv><Skytext>맑음,빗방울,눈날림</Skytext></> )
            else if(pty==="7") return <><Icondiv><FontAwesomeIcon size={"2x"} icon={snow}/></Icondiv><Skytext>맑음,눈</Skytext></>

        }else if(sky==="3"){//구름많음
            if(pty==="0") return (isnight?<><Icondiv><FontAwesomeIcon size={"2x"} icon={cloudmoon}/></Icondiv><Skytext>구름많음</Skytext></>:<><Icondiv><FontAwesomeIcon size={"2x"} icon={cloudsun}/></Icondiv><Skytext>구름많음</Skytext></>)
            else if(pty==="1")  return (<><Icondiv><FontAwesomeIcon size={"2x"} icon={rain}/> </Icondiv><br/><Skytext>구름많음,비</Skytext></>)
            else if(pty==="2")  return (<><Icondiv><FontAwesomeIcon size={"2x"} icon={woobak}/> </Icondiv><br/><Skytext>구름많음,비,눈</Skytext></>)
            else if(pty==="3") return <><Icondiv><FontAwesomeIcon size={"2x"} icon={snow}/></Icondiv><Skytext>구름많음,눈</Skytext></>
            else if(pty==="5") return (<><Icondiv><FontAwesomeIcon size={"2x"} icon={rain}/> </Icondiv><br/><Skytext>구름많음,빗방울</Skytext></>)
            else if(pty==="6") return (<><Icondiv><FontAwesomeIcon size={"2x"} icon={woobak}/> </Icondiv><br/><Skytext>구름많음,비방울,눈날림</Skytext></>)
            else if(pty==="7") return <><Icondiv><FontAwesomeIcon size={"2x"} icon={snow}/></Icondiv><Skytext>구름많음,눈날림</Skytext></>

        }else if(sky==="4"){//흐림
            if(pty==="0") return (isnight?<><Icondiv><FontAwesomeIcon size={"2x"} icon={cloudmoon}/></Icondiv><Skytext>흐림</Skytext></>:<><Icondiv><FontAwesomeIcon size={"2x"} icon={cloudsun}/></Icondiv><Skytext>흐림</Skytext></>)
                else if(pty==="1")  return (<><Icondiv><FontAwesomeIcon size={"2x"} icon={rain}/> </Icondiv><br/><Skytext>흐림,비</Skytext></>)
                else if(pty==="2")  return (<><Icondiv><FontAwesomeIcon size={"2x"} icon={woobak}/> </Icondiv><br/><Skytext>흐림,비,눈</Skytext></>)
                else if(pty==="3") return <><Icondiv><FontAwesomeIcon size={"2x"} icon={snow}/></Icondiv><Skytext>흐림,눈</Skytext></>
                else if(pty==="5") return (<><Icondiv><FontAwesomeIcon size={"2x"} icon={rain}/> </Icondiv><br/><Skytext>흐림,빗방울</Skytext></>)
                else if(pty==="6") return (<><Icondiv><FontAwesomeIcon size={"2x"} icon={woobak}/> </Icondiv><br/><Skytext>흐림,비방울,눈날림</Skytext></>)
                else if(pty==="7") return <><Icondiv><FontAwesomeIcon size={"2x"} icon={snow}/></Icondiv><Skytext>흐림,눈날림</Skytext></>
        }
    }

    const timepar=(time)=>{
       const numtime= parseInt(time,10);

       //오전오후판별
       const period=numtime>=1200?"오후":"오전";

       let hours=Math.floor(numtime/100);
       if(hours>1200){
            hours-=12;
       }else if(hours===0){
            hours=12; //자정처리
       }
       return (
        <>
        {period}{hours}시
        </>
       )
    }

    return (
    <>{data.time!==""?
    <WeatherContainer>
        <WeatherHeader>
        <WeatherDate>
        {timepar(data.time)}
     
        </WeatherDate>
        </WeatherHeader>
        <WeatherBody>
    <Skyicon>
    
    {//- 하늘상태(SKY) 코드 : 맑음(1), 구름많음(3), 흐림(4)
    
    
    // 강수형태(PTY) 코드 : (초단기) 없음(0), 비(1), 비/눈(2), 눈(3), 빗방울(5), 빗방울눈날림(6), 눈날림(7) 
    }
    {Weatherimo(data.sky,data.pty,data.time)}<br/>
    
    </Skyicon>

    <Tempcss>
        {parseInt(data.t1h)<0
        ?<><Tempicon><FontAwesomeIcon icon={temper} size={"xl"} color="blue"/></Tempicon>
        <Temptext> {data.t1h+"\u2103" } </Temptext>
        </> 
        : <><Tempicon><FontAwesomeIcon icon={temper} size={"xl"} color="red"/></Tempicon>
        <Temptext> {data.t1h+"\u2103" } </Temptext>
        </>}
   
    
    
    </Tempcss>
    <Etc>
    <Humidity>
        <Etcheader>
        습도 
        </Etcheader>
        <Etcicon>
        <FontAwesomeIcon icon={droplet}/> 
        </Etcicon>
        <Etcresult>
        {data.reh}% 
        </Etcresult>
    
   
    
   
  
    </Humidity>
    <Raindrop>
    <Etcheader>
    1시간강수
            </Etcheader>
            <Etcicon>
            <FontAwesomeIcon icon={umbrella}/>
            </Etcicon>
            <Etcresult>
            {data.rn1}
            </Etcresult>
    
    

    </Raindrop>
   
    <Windblow>
    <Etcheader>
    풍속
            </Etcheader>
            <Etcicon>
            <FontAwesomeIcon icon={wind}/> 
            </Etcicon>
            <Etcresult>
            {data.wsd}m/s
            </Etcresult>
    
    
    
    
  
    </Windblow>
    
   
    
    </Etc>
   
    
    </WeatherBody>
    
    </WeatherContainer>
    :<WeatherContainer visi={true}>노데이터</WeatherContainer>}
    </>
    )

}
export default Userweatheritem2;