import { EventSourcePolyfill } from "event-source-polyfill";
import React, { createContext, useEffect, useRef, useState } from "react";
import { useCookies } from "react-cookie";
import AuthCheck from "../customhook/authCheck";
import { useQueryClient } from "@tanstack/react-query";
import { API_BASE } from "../config/api";

//=====================================================================
// 실시간 알림(SSE) 연결
//
// 고친 것
//  1) 토큰이 갱신돼도 옛 토큰으로 붙어 있던 문제 → 토큰을 의존성에 넣어 다시 연결한다.
//  2) onerror 가 비어 있어 401 이 나도 무한 재시도하던 문제 → 인증 오류면 끊는다.
//  3) 연결 객체를 ref 에 들고 있다가 정리한다(로그아웃·언마운트).
//=====================================================================

export const SseContext=createContext();

export function SseProvider({children}){

    const [loginuser]=useCookies(['userinfo', 'Acesstoken', 'Refreshtoken']);

    const logincheck=AuthCheck();
    //실시간 알림 수
    const [alarmChatCount,setAlarmChatCount]=useState(0);
    //sse 연결 상태
    const [isSseConnected,setIsSseConnected]=useState(false);

        const eventSourceRef=useRef(null);
    const queryclient=useQueryClient();

    const accesstoken=loginuser.Acesstoken;
    const refreshtoken=loginuser.Refreshtoken;

    useEffect(()=>{
        //로그아웃 상태면 붙지 않는다.
        if(!logincheck || !accesstoken){
            return undefined;
        }

        console.log("SSE 연결 시작");
        const eventSource=new EventSourcePolyfill(
            `${API_BASE}/ssesub`,
            {
                //서버가 30초마다 하트비트를 보낸다. 그보다 넉넉하게 잡는다.
                heartbeatTimeout:60*5*1000,
                headers:{
                    Authorization:"Bearer "+accesstoken,
                    Refreshtoken:"Bearer "+refreshtoken
                },
                withCredentials:true,
            }
        );
        eventSourceRef.current=eventSource;

        eventSource.onopen=()=>{
            setIsSseConnected(true);
        }

        eventSource.onerror=(err)=>{
            setIsSseConnected(false);

            //EventSource 는 기본적으로 알아서 재연결한다.
            //그런데 토큰이 만료돼 401 이 나는 상황이면 재연결해도 계속 401 이라
            //서버를 초당 여러 번 두드리게 된다. 그런 경우는 끊는 게 맞다.
            const status=err?.status;
            if(status===401 || status===403){
                console.log("SSE 인증 오류. 재연결을 멈춘다.",status);
                eventSource.close();
                eventSourceRef.current=null;
                return;
            }
            //그 외(네트워크 끊김 등)는 폴리필의 자동 재연결에 맡긴다.
            console.log("SSE 연결 끊김. 자동 재연결 대기.");
        }

        //서버가 연결 직후 보내는 확인용 이벤트
        eventSource.addEventListener("connect",()=>{
            console.log("SSE 연결됨");
        })

        //안 읽은 알림 수(연결 시 1회)
        eventSource.addEventListener("unreadcount",(res)=>{
            setAlarmChatCount(Number(res.data));
        })

                //새 댓글 / 대댓글 알림
        const bumpcount=()=>{
            setAlarmChatCount((prev)=>prev+1);
            //열려 있는 알림 목록과 서버의 안 읽음 수도 같이 맞춘다.
            //(배지만 올리면 목록을 열었을 때 방금 온 알림이 안 보인다)
            queryclient.invalidateQueries({queryKey:["notificationdata"]});
            queryclient.invalidateQueries({queryKey:["notificount"]});
        };
        eventSource.addEventListener("noticealarm",bumpcount);
        eventSource.addEventListener("commentalarm",bumpcount);

        return ()=>{
            console.log("SSE 연결 정리");
            eventSource.close();
            eventSourceRef.current=null;
            setIsSseConnected(false);
        }
        //토큰이 바뀌면 새 토큰으로 다시 연결해야 한다.
        },[logincheck,accesstoken,refreshtoken,queryclient])

    return (
        <SseContext.Provider value={{alarmChatCount,setAlarmChatCount,isSseConnected}}>
            {children}
        </SseContext.Provider>
    )
}
