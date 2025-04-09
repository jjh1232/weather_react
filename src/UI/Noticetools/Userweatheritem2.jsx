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
    border: 1px solid blue;
`
const Tempcss=styled.div`
    width: 15%;
    border: 1px solid green;
`
const Etc=styled.div`
    display: flex;
    width: 65%;
    border: 1px solid black;
`
const Humidity=styled.div`
    width: 25%;
`
const Raindrop=styled.div`
     width: 50%;
`
const Windblow=styled.div`
     width: 25%;
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
            if(pty==="0") return (isnight?<><FontAwesomeIcon icon={moon}/><br/>맑음</>:<><FontAwesomeIcon icon={sun}/><br/>맑음</>)
            else if(pty==="1") return (isnight? <><FontAwesomeIcon icon={cloudmoonrain}/><br/>맑음,빗방울</> :<><FontAwesomeIcon icon={rain}/><br/>맑음,빗방울</> )
            else if(pty==="2") return (isnight?<> <FontAwesomeIcon icon={cloudmoonrain}/><br/>비,눈</> :<><FontAwesomeIcon icon={rain}/><br/>비,눈</> )
            else if(pty==="3") return 맑고눈
            else if(pty==="5") return 맑지만빗방울
            else if(pty==="6") return 맑고빗방울눈날림
            else if(pty==="7") return 맑지만눈날림

        }else if(sky==="3"){//구름많음
            if(pty==="0") return (isnight?<><FontAwesomeIcon icon={cloudmoon}/><br/>구름많음</>:<><FontAwesomeIcon icon={cloudsun}/><br/>구름많음</>)
            else if(pty==="1")  return (<><FontAwesomeIcon icon={rain}/> <br/>비</>)
            else if(pty==="2")  return (<><FontAwesomeIcon icon={rain}/> <br/>비,눈</>)
            else if(pty==="3") return 구름많고눈
            else if(pty==="5") return 구름많고빗방울
            else if(pty==="6") return 구름많고빗방울눈날림
            else if(pty==="7") return 구름많고눈날림

        }else if(sky==="4"){//흐림
            if(pty==="0") return (isnight?<><FontAwesomeIcon icon={moonblur}/><br/>흐림</>:<><FontAwesomeIcon icon={sunblur}/><br/>흐림</>)
            else if(pty==="1") return  (isnight?<><FontAwesomeIcon icon={cloudmoonrain}/><br/>비</>:<><FontAwesomeIcon icon={cloudsunrain}/><br/>비</>)
            else if(pty==="2")  return  (isnight?<><FontAwesomeIcon icon={cloudmoonrain}/><br/>비눈</>:<><FontAwesomeIcon icon={cloudsunrain}/><br/>비,눈</>)
            else if(pty==="3") return 흐리고눈
            else if(pty==="5") return (isnight?<><FontAwesomeIcon icon={cloudmoonrain}/><br/>구름많고빗방울</>:<><FontAwesomeIcon icon={cloudsunrain}/><br/>구름많고빗방울</>)
                ///흐리고빗방울
            else if(pty==="6") return 흐리고빗방울눈날림
            else if(pty==="7") return 흐리고눈날림
        }
    }

    

    return (
    <>{data.time!==""?
    <WeatherContainer>
        <WeatherHeader>
        <WeatherDate>
        날짜:{data.date}
        시간:{data.time}
        </WeatherDate>
        </WeatherHeader>
        <WeatherBody>
    <Skyicon>
    
    {//- 하늘상태(SKY) 코드 : 맑음(1), 구름많음(3), 흐림(4)
    
    
    // 강수형태(PTY) 코드 : (초단기) 없음(0), 비(1), 비/눈(2), 눈(3), 빗방울(5), 빗방울눈날림(6), 눈날림(7) 
    },<br/>
    {Weatherimo(data.sky,data.pty,data.time)}<br/>
    
    </Skyicon>

    <Tempcss>
        <br/>
    {data.t1h+"\u2103" }  
    </Tempcss>
    <Etc>
    <Humidity>
    습도 <br/>
    <FontAwesomeIcon icon={droplet}/> <br/>
    {data.reh}% <br/>
  
    </Humidity>
    <Raindrop>
    1시간강수량
    <FontAwesomeIcon icon={umbrella}/> <br/>
    {data.rn1}<br/>
    

    </Raindrop>
   
    <Windblow>
    풍속
    <FontAwesomeIcon icon={wind}/> <br/>
    {data.wsd}m/s<br/>
  
    </Windblow>
    
   
    
    </Etc>
   
    
    </WeatherBody>
    
    </WeatherContainer>
    :<WeatherContainer visi={true}>노데이터</WeatherContainer>}
    </>
    )

}
export default Userweatheritem2;