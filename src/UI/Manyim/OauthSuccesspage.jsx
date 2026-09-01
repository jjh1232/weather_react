import React, { useEffect, useRef } from "react";
import { useCookies } from "react-cookie";
import { consumeOauthTokens } from "../../customhook/oauthTokens";

//OAuth 로그인이 끝나고 백엔드가 돌려보내는 착지 화면.
//백엔드는 토큰을 주소의 프래그먼트(# 뒤)에 실어 보낸다 — oauthTokens.js 참고.
export default function OauthSuccesspage(){
    const [,setCookie]=useCookies(['Acesstoken','Refreshtoken','userinfo']);
    //StrictMode 는 개발 중 effect 를 두 번 실행한다.
    //두 번째에는 이미 프래그먼트를 지운 뒤라 토큰이 없어 실패로 보인다.
    const done=useRef(false);

    useEffect(()=>{
        if(done.current) return;
        done.current=true;

        const ok=consumeOauthTokens(setCookie);

        //로그인 전에 있던 경로로 돌려보낸다. 없으면 메인으로.
        const beforepath=localStorage.getItem("oauthbeforepath");
        localStorage.removeItem("oauthbeforepath");

        if(!ok){
            //토큰이 안 왔다면 로그인이 끝나지 않은 것이다.
            //예전에는 이 경우 아무것도 하지 않아 빈 화면에 멈춰 있었다.
            console.log("OAuth 토큰을 받지 못했습니다.");
            window.location.href="/login";
            return;
        }

        //쿠키·컨텍스트·react-query 캐시에 로그인 상태가 걸쳐 있어서
        //부분 갱신보다 한 번 새로 그리는 편이 확실하다(useLogin.js 와 같은 이유).
        window.location.href=beforepath||"/";
    },[setCookie]);

    return <>로그인 처리 중...</>;
}
