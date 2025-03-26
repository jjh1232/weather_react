import React, { useEffect, useState } from "react";
import styled from "styled-components";
import { useCookies } from "react-cookie";
import CreateAxios from "../../customhook/CreateAxios";
import axios from "axios";
import Userweatheritem2 from "./Userweatheritem2";

const Headers=styled.div`
  
`

const Wrapper=styled.div`

  
`


function Userweather2(props){
    
    const [loginuser,Setloginuser,removeloginuser]=useCookies(['userinfo'])
    const {userregion}=props;
    const axiosinstance=CreateAxios();
    const [weatherdata,setWeatherdata]=useState();
    const [asd,setAsd]=useState(
      {"123":{
        "asd":{sky:1}
      }}
    )

    const [timeindex,setTimeindex]=useState(2);

    useEffect(()=>{
        if(loginuser.userinfo){
          console.log("유저주소있음"+loginuser.userinfo.region)
          axios.get("http://localhost:8081/open/weatherdata",{
            params:{
                region:loginuser.userinfo.region.replaceAll("+"," ")
               
            }
          }).then((res)=>{
            console.log(res)
            console.log(asd)
            setWeatherdata(res.data)
            Setloginuser("weather",res.data[2])
            
          }).catch((err)=>{

          })
        }
        else{

          //유저주소없음
            axios.get("http://localhost:8081/open/weatherdata")
            .then((res)=>{
                console.log("날씨데이터"+res)
                setWeatherdata(res.data)
            }).catch((err)=>{
              console.log("날씨정보를가져오지못했습니다")
            })
          console.log("유저없음")
        }
        
      },[])
    

      
    return(
        
        <Wrapper>
        <Headers>
        {loginuser.userinfo &&loginuser.userinfo.region.replaceAll("+"," ")
       }    
        </Headers>
      
        
          
            <div>
            {weatherdata&&
              <>
            <button onClick={()=>{setTimeindex(previndex=>previndex-1)}}>위로</button>
            { /*키값주면 알아서 렌더링되긴함 useeffect안써도*/ }
          <Userweatheritem2 key={timeindex-1} dates={weatherdata[timeindex-1]} />
              
            <Userweatheritem2 key={timeindex} dates={weatherdata[timeindex]} />

            <Userweatheritem2 key={timeindex+1} dates={weatherdata[timeindex+1]} />

            <button onClick={()=>{setTimeindex(previndex=>previndex+1)}}>앞으로</button>
            </>
}
            <br/>

            </div>
          
        
   
                </Wrapper>
   
    )

}
export default Userweather2;