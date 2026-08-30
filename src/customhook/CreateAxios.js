import React, { useState } from "react";
import axios from "axios";

import  {useCookies}  from "react-cookie";
import { useNavigate } from "react-router-dom";
import { API_BASE } from "../config/api";
import { saveuserinfo } from "./userinfoheader";

/* 로그아웃 처리가 여러 요청에서 동시에 터지면 alert 가 몇 번씩 뜬다.
   모듈 단위로 한 번만 하도록 막아둔다. */
let logouting=false;

 function CreateAxios(){
    /* 의존 쿠키를 반드시 적어야 한다. 인자 없이 useCookies() 를 부르면
       "어떤 쿠키든" 바뀔 때마다 다시 그려지는데, 이 훅은 거의 모든 화면
       컴포넌트가 부르고 있어서 그게 곧 앱 전체 리렌더가 된다.
       여기서 실제로 읽는 건 토큰 두 개뿐이다. */
    const [loginuser,setLoginuser,removeLoginuser]=useCookies(['Acesstoken','Refreshtoken']);

    const navigate=useNavigate();
 const instance= axios.create({
    withCredentials:true,
    baseURL: API_BASE,
 
});
 //모든 api요청의 기본주소지정과 쿠키가포함되도록설정함

//토큰이 죽었을 때의 정리. 여러 번 불려도 한 번만 동작한다.
const forcelogout=(message)=>{
    if(logouting) return;
    logouting=true;

    //패스경로도 넣어줘야 삭제된다함
    removeLoginuser("Refreshtoken",{path:`/`});
    removeLoginuser("Acesstoken",{path:`/`});
    removeLoginuser("userinfo",{path:`/`});
    removeLoginuser("weather",{path:`/`});

    alert(message||"로그인이 만료되었습니다. 다시 로그인해주세요");
    //쿠키가 지워진 상태로 남은 화면이 계속 요청을 날리지 않도록 이동시킨다
    navigate("/login");
    //다음 로그인에서 다시 동작해야 한다
    setTimeout(()=>{logouting=false;},1000);
}

instance.interceptors.request.use(
    //요청전달전헤더에토큰넣기
    
    (config)=>{
        //요청경로확인
        console.log("요청url:"+config.url)
        
        if(config.headers.Authorization){
            //Authorization이 존재하는헤더의경우 
            //아마 보통 재요청시
            console.log("헤더에 액세스잇는경우")
            return config;
        }
        else{
            //헤더가없을경우
            console.log("헤더가비어있는처음!")
            const newConfig={...config};
            if(loginuser.Acesstoken){
            const Accesstoken="Bearer "+loginuser.Acesstoken;
            
            newConfig.headers.Authorization=Accesstoken;
            }else{
                //혹시남아있을수있으니삭제
                delete newConfig.headers.Authorization;
            }

            return newConfig;
        }
   
    },(err)=>{
        console.log("요청단계에러")
        //만약 액세스토큰요청후 
        //에러객체넘김
        //에러 발생시 그에러를 다음으로 던질때 사용
        return Promise.reject(err);
    }
)

instance.interceptors.response.use(
     (res)=>{
         const accessToken = res.headers.get
      ? res.headers.get("Authorization")
      : res.headers["authorization"]; // fetch와 axios 호환
    const refreshToken = res.headers.get
      ? res.headers.get("refreshtoken")
      : res.headers["refreshtoken"];

        /* 예전엔 여기서 매 응답마다 removeLoginuser("Acesstoken") 을 먼저 불렀다.
           path 를 안 줘서 대부분 무효였지만, 주소가 "/" 인 화면에서는 실제로 지워져
           토큰을 들고 오지 않은 평범한 응답 하나에 로그아웃되곤 했다.
           set 이 어차피 덮어쓰므로 지울 필요가 없다. */
        if (accessToken) {
          setLoginuser("Acesstoken", accessToken, { path: "/" });
        }
        if (refreshToken) {
          setLoginuser("Refreshtoken", refreshToken, { path: "/" });
        }
        /* 회원정보·프로필을 고치거나 토큰이 재발급되면 백엔드가 userinfo 헤더를
           같이 내려준다. 예전엔 백엔드가 쿠키로 심어서 배포하면 안 보였다. */
        saveuserinfo(res, setLoginuser);
        return res;
    },(err)=>{

        //서버가 안 떠 있거나 네트워크가 끊기면 err.response 자체가 없다.
        //예전엔 바로 err.response.status 를 읽어서 인터셉터 안에서 TypeError 가 났다.
        if(!err.response){
            console.log("응답없음(네트워크/서버다운)");
            return Promise.reject(err);
        }

        const original=err.config||{};

        //401 이면 한 번만 리프레쉬를 시도한다(_retry 가 없으면 무한 루프가 된다)
        if(err.response.status===401 && !original._retry){
            original._retry=true;

            const refreshtoken=loginuser.Refreshtoken;
            if(!refreshtoken){
                forcelogout();
                return Promise.reject(err);
            }

            //baseURL 이 붙은 instance 로 부른다.
            //예전엔 맨 axios 로 "/refresh" 를 불러서 백엔드가 아니라
            //리액트 개발서버(3001) 로 나갔다.
            return instance.get("/refresh",{
                headers:{
                    Refreshtoken:"Bearer "+refreshtoken
                }
            }).then((res)=>{
                const newaccess=res.headers.get
                    ? res.headers.get("Authorization")
                    : res.headers["authorization"];

                if(!newaccess){
                    forcelogout();
                    return Promise.reject(err);
                }

                //응답 인터셉터가 이미 쿠키에 새 토큰을 넣어줬다.
                //실패했던 요청의 헤더만 갈아끼워 다시 보낸다.
                original.headers.Authorization="Bearer "+newaccess;
                return instance(original);

            }).catch((refresherr)=>{
                console.log("리프레쉬토큰도오류!")
                forcelogout();
                /* 예전엔 여기서 아무것도 return 하지 않아 프로미스가 undefined 로
                   "성공" 처리됐다. 호출한 쪽이 res.data 를 읽다가
                   "Cannot read properties of undefined" 로 터졌다. */
                return Promise.reject(refresherr);
            })
        }

        return Promise.reject(err);
    }
)

return instance
 }


export default CreateAxios;
