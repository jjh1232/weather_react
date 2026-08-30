import { useState } from "react";
import axios from "axios";
import { useCookies } from "react-cookie";
import { useToast, messageFromError } from "../UI/Feedback/FeedbackProvider";
import { API_BASE } from "../config/api";
import { saveuserinfo } from "./userinfoheader";

//=====================================================================
// 로그인 제출 로직 한 곳으로.
//  - 사이드바 위젯(Loginpage)과 로그인 페이지(Loginmain)가 같이 쓴다.
//  - 토큰도 유저정보도 쿠키가 아니라 응답 "헤더"로 온다
//    (Authorization / Refreshtoken / userinfo).
//    axios 1.x 의 headers 는 AxiosHeaders 객체라 .get() 으로 읽는다.
//  - 예전엔 userinfo 만 백엔드가 쿠키로 심어줬다. 배포하면 도메인이 갈라져
//    프론트가 못 읽는다(customhook/userinfoheader.js 주석 참고).
//=====================================================================
export default function useLogin(){

    const [,Setloginuser]=useCookies(['userinfo']);
    const toast=useToast();
    const [issending,setIssending]=useState(false);

    /**
     * @param form {username, password}
     * @param options.redirectto 성공 후 이동할 주소. 없으면 현재 화면을 새로고침한다.
     * @returns 성공 여부
     */
    const login=async(form,options)=>{
        const username=(form?.username||"").trim();
        const password=form?.password||"";

        if(!username){ toast.info("이메일을 입력해주세요."); return false; }
        if(!password){ toast.info("비밀번호를 입력해주세요."); return false; }

        setIssending(true);
        try{
            const result=await axios.post(`${API_BASE}/login`,{username,password});

            //path 를 반드시 준다. 안 주면 로그인한 화면 주소를 기준으로 심겨서
            //(/notice/twitform 에서 로그인하면 path=/notice) 로그아웃할 때
            //path:"/" 로 지우는 쿠키와 서로 다른 쿠키가 된다.
            Setloginuser("Acesstoken",result.headers.get("Authorization"),{path:"/"});
            Setloginuser("Refreshtoken",result.headers.get("Refreshtoken"),{path:"/"});
            saveuserinfo(result,Setloginuser);

            //로그인 상태가 쿠키·컨텍스트·react-query 캐시에 걸쳐 있어서
            //부분 갱신보다 한 번 새로 그리는 편이 확실하다.
            if(options?.redirectto) window.location.href=options.redirectto;
            else window.location.reload();

            return true;
        }catch(err){
            //서버가 msg 로 사유를 내려준다(비밀번호 불일치 등).
            toast.error(err?.response?.data?.msg
                || messageFromError(err,"로그인하지 못했습니다. 이메일과 비밀번호를 확인해주세요."));
            setIssending(false);
            return false;
        }
        //성공하면 화면이 통째로 바뀌므로 issending 을 되돌리지 않는다.
    }

    return {login,issending};
}
