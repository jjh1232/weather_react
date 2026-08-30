import React, { useEffect, useRef } from "react";
import { useCookies } from "react-cookie";
import { consumeOauthTokens } from "../customhook/oauthTokens";

//소셜 로그인은 됐지만 추가정보가 필요한 신규 가입자(ROLE_TEMP)가 도착하는 화면.
//백엔드가 /oauthsuccess 와 똑같이 프래그먼트로 토큰을 실어 보낸다.
//추가정보를 저장하려면 그 토큰이 필요하므로 여기서도 먼저 꺼내 둔다.
export default function Oauth2userextra(){
    const [cookies,setCookie]=useCookies(['Acesstoken','Refreshtoken','userinfo']);
    const done=useRef(false);

    useEffect(()=>{
        if(done.current) return;
        done.current=true;
        consumeOauthTokens(setCookie);
    },[setCookie]);

    //TODO 추가정보 입력 폼은 아직 구현 전이다.
    return (
        <>
        oauth2유저추가정보
        </>
    )
}
