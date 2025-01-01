import React, { useEffect, useState } from "react";
import styled from "styled-components";
import { useCookies } from "react-cookie";
import CreateAxios from "../customhook/CreateAxios";
import axios from "axios";
import Userweatheritem from "./UserweatherItem";

const Wrapper=styled.div`

  
`


function Userweather(props){
    
    const [loginuser,Setloginuser,removeloginuser]=useCookies(['userinfo'])
    const {userregion}=props;
    const axiosinstance=CreateAxios();
    const [weatherdata,setWeatherdata]=useState();
    const [asd,setAsd]=useState(
      {"123":{
        "asd":{sky:1}
      }}
    )
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
                console.log(res)
                setWeatherdata(res.data)
            }).catch((err)=>{
              console.log("날씨정보를가져오지못했습니다")
            })
          console.log("유저없음")
        }
        
      },[])
    

    return(
        <div>
        <Wrapper>
       {loginuser.userinfo &&loginuser.userinfo.region.replaceAll("+"," ")
       }
        {weatherdata && weatherdata.map((data,index)=>{
          return(
            <div key={index}>

            <Userweatheritem dates={data} />
            <br/>
            </div>
          )
        })}
   
                </Wrapper>
    </div>
    )

}
export default Userweather;