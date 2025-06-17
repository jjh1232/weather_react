import React, { useState } from "react";
import axios from "axios";

import  {useCookies}  from "react-cookie";
import { useNavigate } from "react-router-dom";


 function CreateAxios(){
     const [loginuser,setLoginuser,removeLoginuser]=useCookies();

    const navigate=useNavigate();
 const instance= 
 //모든 api요청의 기본주소지정과 쿠키가포함되도록설정함
axios.create({
    withCredentials:true,
    baseURL:"http://localhost:8081",
 
})

instance.interceptors.request.use(
    //요청전달전헤더에토큰넣기
    
    (config)=>{
        //요청경로확인
        console.log("요청url:"+config.url)
        
        if(config.headers.Authorization){
            //Authorization이 존재하는헤더의경우 
            console.log("헤더에 액세스잇는경우")
            return config;
        }
        else{
            //헤더가없을경우
            console.log("헤더가비어있는처음!")
            const Accesstoken="Bearer "+loginuser.Acesstoken;
            const newConfig={...config};
            newConfig.headers.Authorization=Accesstoken;
            return newConfig;
        }
   
    },(err)=>{
        console.log("요청단계에러")
        //만약 액세스토큰요청후 
        //에러객체넘김
        return Promise.reject(err);
    }
)

instance.interceptors.response.use(
     (res)=>{
        console.log("요청전달성공 "+res)
       
        
        removeLoginuser("Acesstoken");
        //삭제해줘야함
        setLoginuser("Acesstoken",res.headers.get("Authorization"),{path:"/"})
        setLoginuser("Refreshtoken",res.headers.get("refreshtoken"),{path:"/"})
        
        return res;
    },(err)=>{
        
        console.log("에러코드:"+err.response.status)//500을줌
        if(err.response.status===401){
            console.log("스태이터스에러")
            const refreshtoken=loginuser.Refreshtoken
            err.config.headers.Refreshtoken="Bearer "+refreshtoken;
            //대충아무거나로 인증요청하고 리프레쉬받자
            //내일여기부터
            return axios.get("/refresh",{
                headers:{
                    Refreshtoken:"Bearer "+refreshtoken
                }
            }).then((res)=>{
                console.log("리프레쉬응답")
                removeLoginuser("Refreshtoken");
                removeLoginuser("Acesstoken");
                setLoginuser("Acesstoken",res.headers.get("Authorization"),{path:"/"})
                setLoginuser("Refreshtoken",res.headers.get("Refreshtoken"),{path:"/"})
               //새로운토큰이안들가요
                const Accesstoken="Bearer "+res.headers.get("Authorization");
                console.log("리프레쉬받은헤더:"+res.headers.get("Authorization"))
                //실패응답의 헤더값을 다시 설정한다 
                err.config.headers.Authorization=Accesstoken;
                console.log("새로운엑세스토큰:"+Accesstoken)
                console.log("새로완료설정:"+err.config.headers)
                //다시설정한 토큰으로 재호출

                //여기에 새액세스토큰이안담김..
                return instance(err.config)
            }).catch((err)=>{
                console.log("리프레쉬토큰도오류!")
                alert("다시로그인해주세요!")
                //패스경로도 넣어줘야 삭제된다함
                removeLoginuser("Refreshtoken",{path:`/`});
                removeLoginuser("Acesstoken",{path:`/`});
                removeLoginuser("userinfo",{path:`/`});
                removeLoginuser("weather",{path:`/`});
                //로그아웃
            })  

            
        }
        return Promise.reject(err);
    }
)

return instance
 }


export default CreateAxios;

